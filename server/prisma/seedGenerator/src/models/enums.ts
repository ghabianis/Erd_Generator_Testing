export enum EnumDataType {
    String = 'String',
    Boolean = 'Boolean',
    Int = 'Int',
    BigInt = 'BigInt',
    Float = 'Float', // double precision
    Decimal = 'Decimal', // Decimal(65, 30)
    DateTime = 'DateTime',
    OptionSet = 'OptionSet', // added in this project and will be handled during types extraction from schema.prisma when type start with Enum
    Json = 'Json',

    ArrayOfStrings = 'String[]',
    ArrayOfBoolean = 'Boolean[]',
    ArrayOfInt = 'Int[]',
    ArrayOfBigInt = 'BigInt[]',
    ArrayOfFloat = 'Float[]',
    ArrayOfDecimal = 'Decimal[]',
    ArrayOfDateTime = 'DateTime[]',
    ArrayOfOptionSet = 'OptionSet[]',

    Bytes = 'Bytes', // TODO not handled
}

export enum EnumSeedType {
    // datetime
    DateTime = 'datatype.datetime',
    Future = 'date.future', // never used (coudnt find name pattern for it)
    Past = 'date.past',
    Birthdate = 'date.birthdate',

    // string
    String = 'random.alphaNumeric',
    FirstName = 'name.firstName',
    LastName = 'name.lastName',
    FullName = 'name.fullName',
    Email = 'internet.email',
    Paragraph = 'lorem.paragraph',
    Gender = 'name.sex',
    UUID = 'datatype.uuid',
    Address = 'address.secondaryAddress',
    Image = 'image.imageUrl',
    Avatar = 'image.avatar',
    City = 'address.city',
    Country = 'address.country',
    Text = 'lorem.text',
    Phone = 'phone.number',
    URL = 'internet.url',

    // float
    DecimalNumber = 'datatype.float',

    // number
    WholeNumber = 'datatype.number',
    ZipCode = 'address.zipCode',

    // boolean
    Boolean = 'datatype.boolean',

    // Json
    Json = 'datatype.json',

    // OptionSet
    OptionSet = 'OptionSet',
    CustomOptionSet = 'CustomOptionSet'
}
