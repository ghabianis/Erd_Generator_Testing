import { camelCase } from "camel-case";
import { capitalizeFirstLetter } from "../formatDataString";


export const tsGenerateSeedDataFileWithRelations = (entityName: string, relationsFields: Object[]) => {
    // entitiesRelationsFieldsMap => [{fieldsFK: [userId], relationTable: User[]?, referencesPK: [id]}]

    // get import of other entites list (json)
    let entitiesListImports: string[] = []
    let pkFkUsedFieldsDeclaration: string[] = []
    let addPkFk: string[] = []

    relationsFields.forEach((field: any) => {
        const relationTableName = field["relationTableAndType"].replace("?", "").replace("[]", "")
        const fieldsFKsList = field["fieldsFK"].slice(1, -1).split(',')
        const referencesPKList = field["referencesPK"].slice(1, -1).split(',')
        if ((fieldsFKsList.length !== referencesPKList.length) || fieldsFKsList.length > 1) throw new Error(`[ERROR] multiple fields relation is not handled :(. on entity ${entityName}, \n field: ${field}`)

        if (relationTableName != entityName) {
            entitiesListImports.push(`import { ${camelCase(relationTableName)}List } from '../${relationTableName}/${relationTableName}-ts';`)
            pkFkUsedFieldsDeclaration.push(`\tlet used${capitalizeFirstLetter(fieldsFKsList[0])}s: any[] = []`)
            addPkFk.push(`
            let ${fieldsFKsList[0]} = undefined
            if (used${capitalizeFirstLetter(fieldsFKsList[0])}s.length < ${camelCase(relationTableName)}List.length) {
                while (used${capitalizeFirstLetter(fieldsFKsList[0])}s.includes(${fieldsFKsList[0]}) || ${fieldsFKsList[0]} === undefined) {
                    ${fieldsFKsList[0]} = ${camelCase(relationTableName)}List[Math.floor(Math.random() * (${camelCase(relationTableName)}List.length))].id
                }
                relationFieldsToAdd["${fieldsFKsList[0]}"] = ${fieldsFKsList[0]} 
                used${capitalizeFirstLetter(fieldsFKsList[0])}s.push(${fieldsFKsList[0]})
            }`)
        }

    })

    entitiesListImports = [...new Set(entitiesListImports)]; // remove duplicated imports

    return `
${entitiesListImports.join('\n')}
import { PrismaClient } from "@prisma/client";
import fs from 'fs'
const prisma = new PrismaClient();

export let ${camelCase(entityName)}List = (JSON.parse(fs.readFileSync('/app/prisma/seed-generated-output/data/${entityName}/${entityName}.json', 'utf-8')))["${entityName}"]

export const add${entityName}SeedData = async() => {
    try {
        ${pkFkUsedFieldsDeclaration.join('\n')}
        
        ${camelCase(entityName)}List = ${camelCase(entityName)}List.map((fields: any) => {
            let relationFieldsToAdd: any = {}
            ${addPkFk.join('\n')}
        
            return Object.keys(relationFieldsToAdd).length == 0 ?  fields : {...fields, ...relationFieldsToAdd}
        })

        
        for (let i = 0; i < ${camelCase(entityName)}List.length; i++) {
            await prisma.${camelCase(entityName)}.upsert({
                where: {
                    id: ${camelCase(entityName)}List[i].id,
                },
                update: ${camelCase(entityName)}List[i],
                create: ${camelCase(entityName)}List[i],
            })

        }
    } catch (error: any) {
        console.log("Error pushing to: ${entityName}")
        console.log("Error:", error)
    }

}`
}

export const tsGenerateSeedDataFile = (entityName: string) => {
    return `
import { PrismaClient } from "@prisma/client";
import fs from 'fs'
const prisma = new PrismaClient();

export let ${camelCase(entityName)}List = (JSON.parse(fs.readFileSync('/app/prisma/seed-generated-output/data/${entityName}/${entityName}.json', 'utf-8')))["${entityName}"]

export const add${entityName}SeedData = async() => {
    try {
        for (let i = 0; i < ${camelCase(entityName)}List.length; i++) {
            await prisma.${camelCase(entityName)}.upsert({
                where: {
                    id: ${camelCase(entityName)}List[i].id,
                },
                update: ${camelCase(entityName)}List[i],
                create: ${camelCase(entityName)}List[i],
            })

        }
    } catch (error: any) {
        console.log("Error pushing to: ${entityName}")
        console.log("Error:", error)
    }

}`
}

export const tsGenerateSeedRunnerFile = (entityNamesList: string[]) => {
    let functionsList: string[] = []
    let importsList: string[] = []
    entityNamesList.forEach((entity: string) => {
        importsList.push(`import { add${entity}SeedData } from "./data/${entity}/${entity}-ts"\n`)
        functionsList.push(`\tawait add${entity}SeedData()\n`)
    })

    return `
${importsList.map(importString => importString).join('')}
export const pushSeed = async() => {
    ${functionsList.map(functionString => functionString).join('')}
}
pushSeed()
        `

}