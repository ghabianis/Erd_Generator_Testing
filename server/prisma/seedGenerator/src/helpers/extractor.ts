import path from "path";
import { DEFAULT_SEED_SIZE } from "../config/config";
import { EnumSeedType } from "../models/enums";
import { ENTITY, FIELD, VIEW } from "../models/interfaces";
import { ExtractEntityList } from "./extractor/ExtractEntityList";
import { ExtractEnumList } from "./extractor/ExtractEnumList";
import { readFile } from "./fileManager";

export const extractor = async (schema_path: string, seed_params: string): Promise<[ENTITY[], VIEW[], Map<string, Object[]>]> => {
    try {
        // read data from schema.prisma
        const data: string = await readFile(schema_path);

        // extract Enums
        const enum_regex = /enum\s\w*\s*{(\n|.)*?}/gmi
        const extracted_enums_string: string[] | null = data.match(enum_regex)
        let EnumsJson: string = ''
        if (!extracted_enums_string)
            console.log(`[Extractor] Extracted 0 enums`)
        else
            EnumsJson = ExtractEnumList(extracted_enums_string)


        // extract models
        const model_regex = /((.*(\n|\r|\r\n)){1})model\s\w*\s*{(\n|.)*?}/gmi
        const extracted_models_string: string[] | null = data.match(model_regex)

        // separate models into entities and views
        let entitiesList: string[] = []
        let viewsList: string[] = [] // viewsList not used

        extracted_models_string?.forEach(element => {
            if (element.includes("/// @view"))
                viewsList.push(element.split('\n').slice(1).join('\n')) // remove first line (needed to check if its view)
            else
                entitiesList.push(element.split('\n').slice(1).join('\n'))
        });

        if (!entitiesList)
            throw new Error(`[Extractor] Coudn't detect any Entities`)

        const [EntitesJson, entitiesRelationsFieldsMap] = ExtractEntityList(entitiesList, EnumsJson)
        // custom seed params file
        const customSeedParams: any = (JSON.parse(await readFile(path.resolve(__dirname, '../config/custom_seed_config.json'))))
        const entitiesThatHaveCustomSeed = Object.keys(customSeedParams) // list of entites to override seed params

        // json to entity list
        let entityList: ENTITY[] = JSON.parse(EntitesJson).map((entity: any) => {
            const entityName = Object.keys(entity)[0]

            // is entity disabled ?
            const disabledGenerateEntity = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["disable-gen"]
                ? customSeedParams[entityName]["disable-gen"]
                : false
            if (disabledGenerateEntity) return

            let fields = entity[entityName]

            // custom field seed params (field lvl)
            const disableGenearteFields: string[] = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["disable-gen-fields"]
                ? customSeedParams[entityName]["disable-gen-fields"]
                : []

            // remove disabled generate seed for fields
            if (disableGenearteFields.length > 0)
                fields = fields.filter((field: any) => !disableGenearteFields.includes(field.fieldName))

            // custom field seed params (field lvl)
            const fieldParams = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["fields-params"]
                ? customSeedParams[entityName]["fields-params"]
                : undefined
            if (fieldParams !== undefined) {
                const fieldsNamesListToChangeParams = Object.keys(fieldParams)
                fields = fields.map((field: FIELD) => {
                    if (fieldsNamesListToChangeParams.includes(field.fieldName))
                        field.params = fieldParams[field.fieldName]

                    return field
                })
            }

            // custom static fields
            const staticFields = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["fields-static"]
                ? customSeedParams[entityName]["fields-static"]
                : undefined
            if (staticFields !== undefined) {
                const fieldsNamesListToChangeParams = Object.keys(staticFields)
                fields = fields.map((field: FIELD) => {
                    if (fieldsNamesListToChangeParams.includes(field.fieldName))
                        field.static = staticFields[field.fieldName]
                    return field
                })
            }

            // custom field option-sets (field lvl)
            const optionSetsFields = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["fields-custom-option-sets"]
                ? customSeedParams[entityName]["fields-custom-option-sets"]
                : undefined
            if (optionSetsFields !== undefined) {
                const fieldsNamesListToChange = Object.keys(optionSetsFields)
                fields = fields.map((field: FIELD) => {
                    if (fieldsNamesListToChange.includes(field.fieldName)) {
                        field.optionList = optionSetsFields[field.fieldName]
                        field.fieldSeedType = EnumSeedType.CustomOptionSet
                    }
                    return field
                })
            }
            // custom seed params (entity lvl)
            const seedParams = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["fake-data-config"]
                ? customSeedParams[entityName]["fake-data-config"]
                : seed_params

            // custom seed size
            const seed_size = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["seed-size"]
                ? customSeedParams[entityName]["seed-size"]
                : DEFAULT_SEED_SIZE

            // custom seed types
            const customSeedTypes = entitiesThatHaveCustomSeed.includes(entityName) && customSeedParams[entityName]["fields-seed-type"]
                ? customSeedParams[entityName]["fields-seed-type"]
                : undefined
            if (customSeedTypes !== undefined) {
                const fieldsNamesListToAddCustomSeedType = Object.keys(customSeedTypes)
                fields = fields.map((field: FIELD) => {
                    if (fieldsNamesListToAddCustomSeedType.includes(field.fieldName))
                        if (Object.keys(EnumSeedType).includes(customSeedTypes[field.fieldName]))
                            field.fieldSeedType = (<any>EnumSeedType)[customSeedTypes[field.fieldName]]
                    return field
                })
            }

            // remove relations fields 
            fields = fields.filter((field: FIELD) => {
                const relationsList = entitiesRelationsFieldsMap.get(entityName)
                if (relationsList === undefined)
                    return true
                else
                    return !relationsList.some((relation: any) => relation.fieldsFK == `[${field.fieldName}]`)
            })

            return {
                entityName: entityName,
                fields: fields,
                seedParams: seedParams,
                seedSize: seed_size
            } as ENTITY;
        });

        // remove undefined values from entityList (disable-gen)
        entityList = entityList.filter((entity: any) => entity !== undefined)

        return [entityList, [], entitiesRelationsFieldsMap] // []? : views list not used
    } catch (err) {
        console.log("[Extractor] Error: ", err)
        throw new Error("[Extractor] Error")
    }
}

