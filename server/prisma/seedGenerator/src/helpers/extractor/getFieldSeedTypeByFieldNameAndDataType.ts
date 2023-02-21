import { EnumDataType, EnumSeedType } from "../../models/enums";


// choose seed type based on field name and type
export const fieldSeedTypeByFieldNameAndDataType = (
    fieldName: string,
    fieldType: EnumDataType
) => {
    fieldType = fieldType.replace("[]", "") as EnumDataType
    fieldName = fieldName.toLowerCase();

    if (fieldName.includes("zipcode") || fieldName.includes("postal") && fieldType == EnumDataType.String)
        return EnumSeedType.ZipCode;

    if (fieldName.endsWith("edat") && fieldType == EnumDataType.DateTime)
        return EnumSeedType.Past;

    if (fieldName.includes("birth") && fieldType == EnumDataType.DateTime)
        return EnumSeedType.Birthdate;

    if (fieldName.includes("date") && fieldType == EnumDataType.DateTime)
        return EnumSeedType.DateTime;

    if ((fieldName.startsWith("is") || fieldName.startsWith("has")) || fieldType == EnumDataType.Boolean)
        return EnumSeedType.Boolean;

    if ((fieldName.includes("email")) && fieldType == EnumDataType.String)
        return EnumSeedType.Email;

    if (fieldName.includes("price") && fieldType == EnumDataType.Float)
        return EnumSeedType.DecimalNumber;

    if (
        fieldName.includes("quantity") ||
        fieldName.includes("qty") ||
        fieldName.endsWith("count") && fieldType == EnumDataType.Int
    )
        return EnumSeedType.WholeNumber;

    if (fieldName.includes("description") && fieldType == EnumDataType.String)
        return EnumSeedType.Paragraph;

    if ((fieldName.includes("gender") || fieldName.includes("sex")) && fieldType == EnumDataType.String)
        return EnumSeedType.Gender;

    if ((fieldName.startsWith("id") || fieldName.endsWith("id")) && fieldType == EnumDataType.String)
        return EnumSeedType.UUID;

    if (fieldName.includes("address") && fieldType == EnumDataType.String)
        return EnumSeedType.Address;

    if ((fieldName.includes("image") || fieldName.includes("picture")) && fieldType == EnumDataType.String)
        return EnumSeedType.Image;

    if ((fieldName.includes("photo") || fieldName.includes("avatar")) && fieldType == EnumDataType.String)
        return EnumSeedType.Avatar;

    if (fieldName.includes("city") && fieldType == EnumDataType.String)
        return EnumSeedType.City;

    if (fieldName.includes("country") && fieldType == EnumDataType.String)
        return EnumSeedType.Country;

    if (fieldName.endsWith("text") && fieldType == EnumDataType.String)
        return EnumSeedType.Text;

    if (fieldName.includes("phone") && fieldType == EnumDataType.String)
        return EnumSeedType.Phone;

    if (fieldName.includes("firstname") && fieldType == EnumDataType.String)
        return EnumSeedType.FirstName;

    if (fieldName.includes("lastname") && fieldType == EnumDataType.String)
        return EnumSeedType.LastName;

    if (fieldName.includes("name") && fieldType == EnumDataType.String)
        return EnumSeedType.FullName;

    if ((fieldName.endsWith("url") || fieldName.endsWith("link")) && fieldType == EnumDataType.String)
        return EnumSeedType.URL;

    if (fieldType == EnumDataType.String)
        return EnumSeedType.String;

    if (fieldType == EnumDataType.Int)
        return EnumSeedType.WholeNumber;

    if (fieldType == EnumDataType.Float)
        return EnumSeedType.DecimalNumber;

    if (fieldType == EnumDataType.DateTime)
        return EnumSeedType.DateTime;

    if (fieldType == EnumDataType.OptionSet)
        return EnumSeedType.OptionSet;

    if (fieldType == EnumDataType.Json)
        return EnumSeedType.Json;

};
