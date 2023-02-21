import { FIELD } from "../../models/interfaces";
import { EnumDataType } from "../../models/enums";
import { fieldSeedTypeByFieldNameAndDataType } from "../extractor/getFieldSeedTypeByFieldNameAndDataType";

export const ExtractEntityList = (models: Array<string>, enums: string): [string, Map<string, Object[]>] => {
    let entityList: Array<Object> = []; // [{'User': [{'fieldName': 'firstName', 'fieldType': 'String', }] }] new Map<string, Array<string>>()
    let entitiesRelationsFieldsMap = new Map<string, Object[]>()// keep track of relation fields { "entiyName": [{fieldsFK: [userId], relationTable: User[]?, referencesPK: [id]}] }
    const listOfEnums = enums ? JSON.parse(enums) : []
    for (var item of models) {
        var model_data = item.split("\n").map((item: string) => item.trim())
        var model_name = model_data[0].split(" ")[1]
        var fields: Array<FIELD> = []
        for (var line of model_data.slice(1, -1)) {
            if (!line.startsWith('@@') && (line.length > 0)) { // dont take (@@unique line and empty lines)
                line = line.replace(/ {1,}/g, '|');
                var splitted_fields = line.split("|")
                if (splitted_fields.length > 2) {
                    var concatinated_params = splitted_fields.slice(2).join(' ')
                    splitted_fields.splice(2)
                    splitted_fields.push(concatinated_params)
                }

                const fieldName = splitted_fields[0]
                const fieldDataType = splitted_fields[1].startsWith("Enum") ? EnumDataType.OptionSet : splitted_fields[1].replace("?", "").replace("[]", "") as EnumDataType
                const required = !splitted_fields[1].includes("?")
                const relation = !splitted_fields[1].startsWith("Enum") && !Object.values(EnumDataType).includes(fieldDataType)  // relation when field type is not in EnumDataType and doesn't start with enum (enum is not a relation)
                const prisma_params = splitted_fields[2]
                const optionList = listOfEnums.hasOwnProperty(splitted_fields[1].replace("?", "") as EnumDataType) ? listOfEnums[splitted_fields[1].replace("?", "") as EnumDataType] : undefined
                const fieldSeedType = fieldSeedTypeByFieldNameAndDataType(fieldName, fieldDataType)
                const isArray = fieldDataType.includes("[]") ? true : false
                let generateSeed: boolean | undefined = undefined

                // populate entitiesRelationsFieldsMap map
                if (relation) {
                    if (splitted_fields[2]) {
                        const extractedFields = splitted_fields[2].match(/fields:(\s)*\[.*?]/gi)
                        const extractedRefernces = splitted_fields[2].match(/references:(\s)*\[.*?]/gi)

                        if (extractedFields == null || extractedRefernces == null) {
                            generateSeed = false // this is one to many relationship (1 is the current entity) - dont generate seed
                        } else {
                            const fieldsFK = extractedFields[0].match(/\[(.*?)\]/)![0]
                            const referencesPK = extractedRefernces[0].match(/\[(.*?)\]/)![0]
                            const relationTableAndType = splitted_fields[1]
                            
                            const realtionFieldData: Object = { fieldsFK: fieldsFK, relationTableAndType: relationTableAndType, referencesPK: referencesPK }
                            
                            if (entitiesRelationsFieldsMap.has(model_name))
                                entitiesRelationsFieldsMap.set(model_name, [...entitiesRelationsFieldsMap.get(model_name)!, realtionFieldData])
                            else
                                entitiesRelationsFieldsMap.set(model_name, [realtionFieldData])
                        }

                    } else {
                        generateSeed = false
                    }

                }
                fields.push({
                    fieldName: fieldName,
                    fieldDataType: fieldDataType,
                    required: required,
                    relation: relation,
                    prisma_params: prisma_params,
                    optionList: optionList,
                    fieldSeedType: fieldSeedType,
                    isArray: isArray,
                    generateSeed: generateSeed !== undefined ? generateSeed : (!fieldName.toLowerCase().includes("deletedat")) // if is deletedAt dont generate
                })
            }
        }
        entityList.push({ [model_name]: fields })
    }
    return [JSON.stringify(entityList), entitiesRelationsFieldsMap]
}