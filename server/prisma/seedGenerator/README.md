This project is a seed generator from schema.prisma (for DEV-FACTORY)

# Get Started

- You can test your own prisma schema in seed-generator project by changing `schema.prisma`.
  Commands:
  `$ npm install`
  `$ npm run start` (generate fake data and their push scripts in `output_path/seed-generated-output`)
  `$ npm run build` (export the generator in build/ folder to use in any project)

- Or you can impliment seed-generator in your project by:
  in your server package.json add :
  - scripts: `"seed:generate": "ts-node prisma/seedGenerator/src/genSeed",
"seed:push": "ts-node prisma/seed-generated-output/seed"`
  - dependencies: `"@faker-js/faker": "^7.6.0",
"shelljs": "^0.8.5",
"camel-case": "^4.1.2"`
  - devDependencies: `"@types/node": "^18.11.18"`

# Summary

##### Seed generator consist of 2 modules

- ##### extractor:
  extract models (entities) & enums from `schema.prisma` file
- ##### generator:
  extract seed type from field name and type to get an accurate seed data
  then create 2 files for every entity generated:
  - `entity.json`: contains all the fake date
  - `entity-ts.ts`: list of data imported from `entity.json` and `addEntitySeedData()` function that push fake data with `prisma.entity.upsert()`.
    all this data will be located in `output_path/data`.
  - in addition to the `data` forlder, `output_path` will have another file `seed.ts` that calls all the functions in every `output_path/data/entity/entity-ts.ts`

# Convention

to get the best out of this generator you have to follow a naming convention for field names and enums names
(if you have an existing schema already in use, you can configure everything manually )

- Enums: should always start with Enum
- Fields (for more fields params check `SEED DATA TYPE & FakerJs Section`:

|      NAME       |    NAME     |   NAME    | Field Data Type | Seed Data Type |             Default Params              |
| :-------------: | :---------: | :-------: | :-------------: | :------------: | :-------------------------------------: |
|    includes     | starts with | ends with |                 |                |                                         |
| zipcode, postal |             |           |     String      |    ZipCode     |                  ####                   |
|                 |             |           |                 |     Future     |                    2                    |
|                 |             |   edat    |    DateTime     |      Past      |                    2                    |
|      birth      |             |           |    DateTime     |   Birthdate    | { "min": 18, "max": 65, "mode": "age" } |
|      date       |             |           |    DateTime     |    DateTime    |                                         |
|                 |   is, has   |           |     Boolean     |    Boolean     |                                         |
|      email      |             |           |     String      |     Email      |                                         |
|      price      |             |           |      Float      | DecimalNumber  |          {"min": 0, "max": 10}          |
|  quantity, qte  |             |   count   |       Int       |  WholeNumber   |          {"min": 0, "max": 10}          |
|   description   |             |           |     String      |   Paragraph    |                    2                    |
|      text       |             |           |     String      |      Text      |                                         |
|   gender, sex   |             |           |     String      |     Gender     |                                         |
|                 |     id      |    id     |     String      |      UUID      |                                         |
|     country     |             |           |     String      |    Country     |                                         |
|      city       |             |           |     String      |      City      |                                         |
|     address     |             |           |     String      |    Address     |                                         |
| image, picture  |             |           |     String      |     Image      |                640, 480                 |
|  avatar, photo  |             |           |     String      |     Avatar     |                                         |
|      phone      |             |           |     String      |     Phone      |             +216 ## ### ###             |
|    firstname    |             |           |     String      |   FirstName    |                                         |
|    lastname     |             |           |     String      |    LastName    |                                         |
|      name       |             |           |     String      |    FullName    |                                         |
|                 |             | url, link |     String      |      URL       |                                         |
|                 |             |           |                 |     String     |                   10                    |
|                 |             |           |                 |  WholeNumber   |          {"min": 0, "max": 10}          |
|                 |             |           |                 | DecimalNumber  |          {"min": 0, "max": 10}          |
|                 |             |           |                 |    DateTime    |                                         |

_<!>: when chaging params in `custom_seed_config.json`, object params key should have double quotes `""`
(ex: Birthdate format: `{ “min”: 1980, “max”: 2001, “mode”: “year” }`)_

# Customizing and configuration

with `src/config/custom_seed_config.json` file you can use:

- ###### fake-data-config (entity lvl):

  to customize fake data generator rules (ex: changing phone number format)

- ###### seed-size (entity lvl):

  count of rows wanted to generate

- ###### fields-params (field lvl):
  with field name you can override entity seed config (`fake-data-config`) for a specific field
  (for exemple Phone seed type is configured to be "+216 ## ### ###" in entity lvl but you can override it to
  be "## ### ###" for a specific field, all Phones in this entity will get the first format but the specified one)
- ###### fields-static (field lvl):

  giving a field static data and will never generate fake data (ex "password": "test-password" will generate test-password as value to the field password for all rows)

- ###### fields-seed-type (field lvl)

  escape the generator recommanded seed type and specify one (from list of seed types)
  (for exemple having field called 'owner' will generate random string but adding "owner": "FullName" will use the fullName generator instead)

- ###### disable-gen-fields (field lvl)

  disable generating seed data for given fields list (ex: `disable-gen-fields`: ["field1", "field2"])

- ###### disable-gen (entity lvl)

  by default `disable-gen` value is false for all entites, but assigning true to `disable-gen` will not generate seed data for that entity

- ###### fields-custom-option-sets
  to define custom option set values for fields that are not defined in `schema.prisme` (undetectable enums)

# Seed Data Types & FakerJs

| Seed Data Type | FakerJs                                                                           | Supported FakerJs params |
| :------------- | :-------------------------------------------------------------------------------- | :----------------------- |
| ZipCode        | [address.zipCode](https://fakerjs.dev/api/address.html#zipcode)                   | Yes                      |
| Future         | [date.future](https://fakerjs.dev/api/date.html#future)                           | Yes                      |
| Past           | [date.past](https://fakerjs.dev/api/date.html#past)                               | Yes                      |
| Birthdate      | [date.birthdate](https://fakerjs.dev/api/date.html#birthdate)                     | Yes                      |
| DateTime       | [datatype.datetime](https://fakerjs.dev/api/datatype.html#datetime)               | Not Tested               |
| Boolean        | [datatype.boolean](https://fakerjs.dev/api/datatype.html#boolean)                 |                          |
| Email          | [internet.email](https://fakerjs.dev/api/internet.html#email)                     | No                       |
| Paragraph      | [lorem.paragraph](https://fakerjs.dev/api/lorem.html#paragraph)                   | Yes                      |
| Text           | [lorem.text](https://fakerjs.dev/api/lorem.html#text)                             |                          |
| Gender         | [name.sex](https://fakerjs.dev/api/name.html#sex)                                 |                          |
| UUID           | [datatype.uuid](https://fakerjs.dev/api/datatype.html#uuid)                       |                          |
| Country        | [address.country](https://fakerjs.dev/api/address.html#country)                   |                          |
| City           | [address.city](https://fakerjs.dev/api/address.html#city)                         |                          |
| Address        | [address.secondaryAddress](https://fakerjs.dev/api/address.html#secondaryaddress) |                          |
| Image          | [image.imageUrl](https://fakerjs.dev/api/image.html#imageurl)                     | Yes                      |
| Avatar         | [image.avatar]()                                                                  |                          |
| Phone          | [phone.number](https://fakerjs.dev/api/phone.html#number)                         | Yes                      |
| FirstName      | [name.firstName](https://fakerjs.dev/api/name.html#firstname)                     | No                       |
| LastName       | [name.lastName](https://fakerjs.dev/api/name.html#lastname)                       | No                       |
| FullName       | [name.fullName](https://fakerjs.dev/api/name.html#fullname)                       | No                       |
| URL            | [internet.url](https://fakerjs.dev/api/internet.html#url)                         |                          |
| String         | [random.alphaNumeric](https://fakerjs.dev/api/random.html#alphanumeric)           | Yes                      |
| WholeNumber    | [datatype.number](https://fakerjs.dev/api/datatype.html#number)                   | Yes                      |
| DecimalNumber  | [datatype.float](https://fakerjs.dev/api/datatype.html#float)                     | Yes                      |
| Json           | [datatype.json](https://fakerjs.dev/api/datatype.html#json)                       |                          |
