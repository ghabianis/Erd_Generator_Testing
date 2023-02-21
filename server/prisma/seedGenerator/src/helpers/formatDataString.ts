import { EnumDataType } from "../models/enums";
import { FIELD } from "../models/interfaces";


// check if we need to add quotes or not
export const formatDataString = (field: FIELD, data: string): string => {
    const quotedTypes = [EnumDataType.String, EnumDataType.DateTime, EnumDataType.OptionSet]
    if (field.fieldDataType == EnumDataType.DateTime)
        data = new Date(data).toISOString()

    if (quotedTypes.includes(field.fieldDataType)) // check if we need to add quotes or not
        return `${field.isArray ? '[' : ''} "${data}" ${field.isArray ? ']' : ''}`
    else
        return `${field.isArray ? '[' : ''} ${data} ${field.isArray ? ']' : ''}`
}

export const capitalizeFirstLetter = (data: string): string => {
    return data.charAt(0).toUpperCase() + data.slice(1);
}