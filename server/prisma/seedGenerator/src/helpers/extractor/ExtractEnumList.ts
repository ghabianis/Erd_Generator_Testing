export const ExtractEnumList = (enums: Array<string>): string => {
    let listOfEnums: Object = {}; // [{'EnumSex': ['M', 'F']}] new Map<string, Array<string>>()
    for (var item of enums) {
        var enum_data = item.split("\n").map((item: string) => item.trim())
        var enum_name = enum_data[0].split(" ")[1]
        listOfEnums = { ...listOfEnums, [enum_name]: enum_data.slice(1, -1) }
    }
    return JSON.stringify(listOfEnums)
}