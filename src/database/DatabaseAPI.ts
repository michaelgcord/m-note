import db from './DBManager.js'

const createTables = () => {
    const foldersTable = `
        CREATE TABLE if NOT EXISTS folders (
            id INTEGER PRIMARY KEY,
            parent_id INTEGER,
            name STRING NOT NULL COLLATE NOCASE,
            type INTEGER,
            open INTEGER,
            UNIQUE(type, name)
        )
    `
    db.exec(foldersTable)
}


// CRUD - create, read, update, delete
// folders api

// returns a list of folders whose parent id matches the given id
const getFolders = (id: Number | null) => {
    try {
        const query = `
            SELECT * FROM folders
            WHERE parent_id is ?
            ORDER BY type ASC, name
        `
        const preparedQuery = db.prepare(query)
        const rowList = preparedQuery.all(id)
        return rowList
    } catch (err) {
        console.error(err)
        throw err
    }    
}

// const addFolder = () => {

// }

// const editFolder = () => {

// }

// const deleteFolder = () => {

// }

const checkNameExists = (name: string, type: number) => {
    try {
        const query = "SELECT * FROM folders WHERE name = ? AND type = ?"
        const readQuery = db.prepare(query)
        const res = readQuery.get(name, type)
        if (res) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

export {
    createTables,
    getFolders,
    checkNameExists
}