import { ENTITY } from "../models/interfaces";
import { writeFile, folderExist, mkdir, rmdir } from "./fileManager";
import { generateEntitySeedsJson } from "./generator/generateEntitySeedsJson";


export const jsonGenerateSeedData = async (entityList: Array<ENTITY>, output_path: string) => {
    try {
        // delete output folder if exist
        if (await folderExist(output_path))
            await rmdir(output_path)

        entityList.forEach(async (entity) => {
            const entityFolderPath = `${output_path}/data/${entity.entityName}`
            if (await folderExist(entityFolderPath) == false)
                await mkdir(entityFolderPath)

            await writeFile(`${entityFolderPath}/${entity.entityName}.json`, generateEntitySeedsJson(entity));
        })
    } catch (err) {
        console.log("[Generator-JSON] Error: ", err)
        throw new Error("[Generator-JSON] Error: " + err)
    }
}