import db from './DBManager.js'

const createTables = () => {
    const foldersTable = `
        CREATE TABLE if NOT EXISTS folders (
            id INTEGER PRIMARY KEY,
            parent_id INTEGER,
            name STRING NOT NULL COLLATE NOCASE,
            type TEXT,
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
            ORDER BY type DESC, name
        `
        const preparedQuery = db.prepare(query)
        const rowList = preparedQuery.all(id)
        return rowList
    } catch (err) {
        console.error(err)
        throw err
    }    
}

const getSingleFolder = (id: number) => {
    try {
        const query = db.prepare("SELECT * FROM folders where id is ?")
        const result = query.get(id)
        return result
    } catch (err) {
        console.error(err)
        throw err
    }
}

// adds a new folder into folders table, returns nothing
const addFolder = (name: string, parent_id: number, type: string) => {
    try {
        const insertData = db.prepare("INSERT INTO folders (name, parent_id, type, open) VALUES (?, ?, ?, 0)")
        insertData.run(name, parent_id, type)
        return
    } catch (err) {
        console.error(err)
        throw err
    }
}

const editFolder = (parent_id: number, name: string, open: number, id: number) => {
    try {
        const query = db.prepare("UPDATE folders SET (parent_id, name, open) = (?, ?, ?) WHERE id = ?")
        query.run(parent_id, name, open, id)
    } catch (err) {
        console.error(err)
        throw err
    }
}

// const deleteFolder = () => {

// }

const checkNameExists = (name: string, type: string) => {
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

// Checks if findID is a subfolder of id
const checkSubFolders = (id: number, findID: number) => {
    let found = false
    const findFolder = (id: number) => {
        const folders = getFolders(id)
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id === findID) {
                found = true
                return
            }
            if (!found) {
                findFolder(folders[i].id)
            }
        }
    }
    findFolder(id)
    return found
}

const checkFolderDepth = (id: number) => {
    let maxDepth = 1
    const getFolderDepth = (id: number, depth: number) => {
        if (maxDepth <= depth) {
            maxDepth = depth
        }
        const folders = getFolders(id)
        for (let i = 0; i < folders.length; i++) {
            getFolderDepth(folders[i].id, depth+1)
        }
    }
    getFolderDepth(id, 1)
    return maxDepth
}

export {
    createTables,
    getFolders,
    getSingleFolder,
    addFolder,
    editFolder,
    checkNameExists,
    checkSubFolders,
    checkFolderDepth,
}