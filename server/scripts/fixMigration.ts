import { readdir, readFile, mkdir, writeFile } from 'fs/promises'
var path = require('path');
import { PrismaClient } from "@prisma/client";

// this script for fixing many to many relation ship of setEntityUserColumn
// setEntityUserColumn is disabled by default
// if enabled setEntityUserColumn add  ts-node scripts/fixMigration.ts && in db:migrate-up command (server/package.json) as it need to run before migrate deploy
// result of db:migrate-up in server/package.json: "db:migrate-up": "ts-node scripts/fixMigration.ts && prisma migrate deploy",

const MIGRATION_DIR = "././prisma/migrations"
const client = new PrismaClient();
const getTablesColumnsQuery = `
SELECT 
    tc.table_name,
    kcu.column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
    ON tc.constraint_name = kcu.constraint_name 
    AND tc.table_schema = kcu.table_schema 
    JOIN information_schema.constraint_column_usage AS ccu 
    ON ccu.constraint_name = tc.constraint_name 
    AND ccu.table_schema = tc.table_schema 
WHERE 
    tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'User' AND ccu.table_schema = 'public'
`
const getDirectories = async (source: string) =>
    (await readdir(source, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)


const main = async () => {
    const query = `ALTER TABLE "public"."TABLE_NAME" ALTER COLUMN "COLUMN_NAME" SET DEFAULT requesting_user_id()`
    const results: Array<{ table_name: string; column_name: string; }> = await client.$queryRawUnsafe(getTablesColumnsQuery);
    let queriesToAdd: string[] = results.map((result: any) => {
        return query.replace("TABLE_NAME", result["table_name"]).replace("COLUMN_NAME", result["column_name"])
    })
    const migration_data = queriesToAdd.join("\n")
    console.log("migration_data:", migration_data)
    const migration_folderName = `${new Date().toISOString().replace("T", "").replace("Z", "").split("-").join("").split(":").join("").slice(0, -4)}_migrationdata`
    await mkdir(path.join(MIGRATION_DIR, migration_folderName), { recursive: true }).catch(console.error);
    await writeFile(path.join(MIGRATION_DIR, migration_folderName, "migration.sql"), migration_data)

    // check if queriesToAdd are already added in migrations
    const queriesAlreadyAdded: string[] = []
    const migration_subfolders = await getDirectories(MIGRATION_DIR)
    for (var subfolder of migration_subfolders) {
        const data = await readFile(path.join(MIGRATION_DIR, subfolder, "migration.sql"), { encoding: 'utf8' });
        for (var _query of queriesToAdd)
            if (data.includes(_query)) queriesAlreadyAdded.push(_query)
    }

    // remove query already added in migrations
    console.log("queriesToAdd Before:", queriesToAdd)
    queriesToAdd = queriesToAdd.filter((element) => !queriesAlreadyAdded.includes(element))
    console.log("queriesToAdd After:", queriesToAdd)
    console.log("queriesAlreadyAdded:", queriesAlreadyAdded)
}

main() 
