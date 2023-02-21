import { ENTITY } from "../models/interfaces"
import { tsGenerateSeedDataFile, tsGenerateSeedDataFileWithRelations, tsGenerateSeedRunnerFile } from "./ts-generator/seed.templates"
import { writeFile } from "./fileManager";


export const tsGenerateSeedData = async (entityList: ENTITY[], output_path: string, entitiesRelationsFieldsMap: Map<string, Object[]>) => {
    try {
        // generate all data/entity.ts files 
        entityList.forEach(async (entity: ENTITY) => {
            const entityFolderPath = `${output_path}/data/${entity.entityName}`
            if (entitiesRelationsFieldsMap.has(entity.entityName)) {
                await writeFile(`${entityFolderPath}/${entity.entityName}-ts.ts`, tsGenerateSeedDataFileWithRelations(entity.entityName, entitiesRelationsFieldsMap.get(entity.entityName)!).replace(`\t`, ''));
            }
            else
                await writeFile(`${entityFolderPath}/${entity.entityName}-ts.ts`, tsGenerateSeedDataFile(entity.entityName).replace(`\t`, ''));

        })

        // entityNamesList sorted (relation)
        let sortedEntityNamesList: string[] = []
        while ((sortedEntityNamesList.length < entityList.length)) {
            for (let entity of entityList) {
                if (!sortedEntityNamesList.includes(entity.entityName)) // we still didnt use entityName
                {
                    if (!entitiesRelationsFieldsMap.has(entity.entityName)) // entity doesnt have realtion
                        sortedEntityNamesList.push(entity.entityName)
                    else {
                        // check if needed entites are handled or not 
                        let neededEntites: string[] = entitiesRelationsFieldsMap.get(entity.entityName)?.map((value: any) => value["relationTableAndType"].replace("?", "").replace("[]", ""))!
                        neededEntites = [...new Set(neededEntites.filter(element => element != entity.entityName))]; // remove duplicates
                        const usedEntites = neededEntites.filter(element => sortedEntityNamesList.includes(element))
                        if (usedEntites.length == neededEntites.length) {
                            sortedEntityNamesList.push(entity.entityName)
                        }
                    }
                }
            }
        }

        // generate seed.ts
        await writeFile(`${output_path}/seed.ts`, tsGenerateSeedRunnerFile(sortedEntityNamesList).replace(`\t`, ''));
    } catch (err) {
        console.log("[Generator-TS] Error: ", err)
        throw new Error("[Generator-TS] Error: " + err)
    }
}
