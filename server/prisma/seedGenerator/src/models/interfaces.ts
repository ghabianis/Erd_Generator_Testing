import { EnumDataType, EnumSeedType } from "./enums";

// not used yet
export interface VIEW {

}

export interface ENTITY {
    entityName: string,
    fields: FIELD[],
    seedParams: Object,
    seedSize: number,
    // 
    realtion?: boolean
}

export interface FIELD {
    fieldName: string,
    fieldDataType: EnumDataType,
    fieldSeedType?: EnumSeedType,
    optionList?: Array<any>, // ex: ["M", "F"]
    static?: string, // if static then field will have static data
    isArray: boolean,
    relation?: boolean,
    generateSeed?: boolean,
    required?: boolean,

    // ! TODO not used yet in generator
    params?: string, // seed params ( ex for phone format: +216 ### ### )
    prisma_params?: string, // prisma params ( ex: @id @default(dbgenerated("gen_random_uuid()")) )
}