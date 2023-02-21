export const OUTPUT_PATH = 'prisma/seed-generated-output'
export const SCHEMA_PRISMA_PATH = 'prisma/schema.prisma'

export const DEFAULT_SEED_SIZE = 100
export const SEED_PARAMS: any = {
    DateTime: undefined,
    Boolean: undefined,
    Email: undefined,
    DecimalNumber: '{"min": 0, "max": 10}',
    WholeNumber: '{"min": 0, "max": 10}',
    Paragraph: '2', // sentenceCount
    Gender: undefined,
    UUID: undefined,
    Address: undefined,
    Image: '640, 480', // width, height
    Avatar: undefined,
    City: undefined,
    Country: undefined,
    Text: undefined,
    Phone: '+216 ## ### ###', // format
    Birthdate: '{ "min": 18, "max": 65, "mode": "age" }', // or mode: years
    String: '10', // length
    FirstName: undefined,
    LastName: undefined,
    FullName: undefined,
    Future: '2', // years range 
    Past: '2', // years range
    ZipCode: '####', // format
    URL: undefined,
}