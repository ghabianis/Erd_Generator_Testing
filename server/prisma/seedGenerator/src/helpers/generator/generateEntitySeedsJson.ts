import { EnumDataType, EnumSeedType } from "../../models/enums";
import { formatDataString } from "../formatDataString";
import { faker } from "@faker-js/faker";
import { ENTITY, FIELD } from "../../models/interfaces";


const generateSingleSeedUnit = (field: FIELD, seedParams: Object): string => {
    // @params: fieldSeedType (ex: 'date.future')
    // @return: fake data unit
    try {
        if (field.fieldSeedType !== undefined) {
            const [module, method] = field.fieldSeedType.split(".")
            if (Object.getOwnPropertyNames(faker).includes(module)) { // check if module exist in faker
                const EnumSeedTypeKey = Object.keys(EnumSeedType)[Object.values(EnumSeedType).indexOf(field.fieldSeedType)] as keyof typeof seedParams;
                // image Url doesnt work with faker helpers fake 
                if (method == 'imageUrl') {
                    const [width, height] = ((field.params ?? seedParams[EnumSeedTypeKey]) as string).split(",")
                    return `https://loremflickr.com/${width.trim()}/${height.trim()}`
                }
                return faker.helpers.fake(
                    `{{${module}.${method}${(seedParams.hasOwnProperty(EnumSeedTypeKey) && seedParams[EnumSeedTypeKey]) ? `(${field.params ?? seedParams[EnumSeedTypeKey]})` : ''}}}`
                )
            } else throw Error(`Coudn't find module [${module}] in faker modules`);
        } else console.log("[GENERTAOR-ERROR] fieldSeedType is undefined: ", field.fieldSeedType)
        return "HH"
    } catch (error: any) {
        console.log("Error: ", error)
        throw new Error(error)
    }
}


const generateSingleFieldSeed = (field: FIELD, seedParams: Object): string => {
    // @return (ex: name: 'John')

    // handle static 
    if (field.static)
        return `"${field.fieldName}": ${formatDataString(field, field.static)}`

    // handle option set 
    if ((field.fieldDataType == EnumDataType.OptionSet) || (field.fieldSeedType == EnumSeedType.CustomOptionSet))
        if (field.optionList)
            return `"${field.fieldName}": ${formatDataString(field, field.optionList[(Math.floor(Math.random() * (field.optionList.length)))])}` // return random from optionList 
        else
            throw new Error(`Error: OptionList of is undefined! (need OptionList when dealign with OptionSets)`)

    // handle fake data (faker)
    return `"${field.fieldName}": ${formatDataString(field, generateSingleSeedUnit(field, seedParams))}`
}


const generateSingleEntitySeed = (fields: FIELD[], seedParams: Object) => {
    // @return (ex: {firstname: 'john', lastname: 'doe'}, )
    // remove fields with generateSeed is false
    return `{${fields.filter((field) => field.generateSeed && !field.relation).map((field) => generateSingleFieldSeed(field, seedParams))}},`
}


export const generateEntitySeedsJson = (entity: ENTITY): string => {
    let data = `{"${entity.entityName}": [`
    for (let i = 0; i < entity.seedSize; i++)
        data = data + generateSingleEntitySeed(entity.fields, entity.seedParams)

    data = data.slice(0, -1) + ']}'
    return data
}