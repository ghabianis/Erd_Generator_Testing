import { SCHEMA_PRISMA_PATH, OUTPUT_PATH, SEED_PARAMS } from "./config/config"
import { extractor } from "./helpers/extractor"
import { folderExist } from "./helpers/fileManager"
import { jsonGenerateSeedData } from "./helpers/jsonGenerator"
import { tsGenerateSeedData } from "./helpers/tsGenerator"

async function genSeed({ schema_path = SCHEMA_PRISMA_PATH, output_path = OUTPUT_PATH, seed_params = SEED_PARAMS }) {
    try {
        console.log("[Seed-Generator] Started")
        const outputFolderExist = await folderExist(OUTPUT_PATH)
        // prevent re-generating if output folder exist
        if (outputFolderExist == true) {
            console.log(`[Seed-Generator] Interrupted. output folder already exist. remove '${OUTPUT_PATH}' and re-run script`)
            return
        }

        // extract entityList from  schema.prsima
        console.log("1/3 - [Extractor]: Started")
        return await extractor(schema_path, seed_params).then(async ([entitiesList, _viewsList, entitiesRelationsFieldsMap]) => {
            console.log("1/3 - [Extractor]: Completed")
            // generate fake data from extractor entityList (JSON)
            console.log("2/3 - [Generator-JSON]: Started")
            await jsonGenerateSeedData(entitiesList, output_path)
            console.log("2/3 - [Generator-JSON]: Completed")
            // generate ts files for seed (TS)
            console.log("3/3 - [Generator-TS]: Started")
            await tsGenerateSeedData(entitiesList, output_path, entitiesRelationsFieldsMap)
            console.log("3/3 - [Generator-TS]: Completed")
            console.log("[Seed-Generator] Completed")

        })
    } catch (err) {
        console.log("[SEED] Error: ", err)
        return false
    }
}

genSeed({})