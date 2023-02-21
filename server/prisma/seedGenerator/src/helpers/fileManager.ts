import fs from 'fs';

export const readFile = (path: string): Promise<string> =>
    new Promise((resolve, _reject) => {
        resolve(fs.readFileSync(path, { encoding: 'utf8' }))
    })

export const writeFile = (path: string, data: any): Promise<boolean> =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'utf8', (err) => {
            if (err) reject(err)
            else resolve(true)
        })
    })

export const folderExist = (path: string): Promise<boolean> =>
    new Promise((resolve, _reject) => {
        resolve(fs.existsSync(path))
    })

export const mkdir = (path: string): Promise<boolean> =>
    new Promise((resolve, _reject) => {
        var shell = require('shelljs');
        shell.mkdir('-p', path);
        resolve(true)
    })

export const rmdir = (path: string): Promise<void> =>
    new Promise(async (resolve, _reject) => {
        await fs.rmSync(path, { recursive: true })
        resolve()
    }) 