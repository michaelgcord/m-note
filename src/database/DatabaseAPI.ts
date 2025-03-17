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

    const notesTable = `
        CREATE TABLE if NOT EXISTS notes (
            id INTEGER PRIMARY KEY,
            folder_id INTEGER NOT NULL,
            date_created DATETIME,
            last_date_edited TIMESTAMP,
            html_content TEXT,
            FOREIGN KEY (folder_id) REFERENCES folders(id)
        )
    `

    db.exec(foldersTable)
    db.exec(notesTable)
}



// FOLDERS API

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

// Delete folder and all its subfolders
const deleteFolder = (id: number) => {
    try {
        deleteNotes(id)
        const folders = getFolders(id)
        for (let i = 0; i < folders.length; i++) {
            deleteFolder(folders[i].id)
        }
        const deleteQuery = db.prepare("DELETE FROM folders WHERE id = ?")
        deleteQuery.run(id)
    } catch (err) {
        console.error(err)
        throw err
    }
}

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

// NOTES API

// Gets all notes associated with folder id
const getNotes = (folder_id: number) => {
    try {
        const query = `
            SELECT * FROM notes
            WHERE folder_id is ?
        `
        const preparedQuery = db.prepare(query)
        const rowList = preparedQuery.all(folder_id)
        return rowList
    } catch (err) {
        console.error(err)
        throw err
    }
}

const addNote = (folder_id: number) => {
    try {
        const insertData = db.prepare("INSERT INTO notes (folder_id, date_created, last_date_edited) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)")
        insertData.run(folder_id)
        return true
    } catch (err) {
        console.error(err)
        throw err
    }    
}

const editNote = (note_id: number, last_date_edited: string, html_content: string) => {
    try {
        const query = db.prepare("UPDATE notes SET (last_date_edited, html_content) = (?, ?) WHERE id = ?")
        query.run(last_date_edited, html_content, note_id)
        return true
    } catch (err) {
        console.error(err)
        throw err
    }
}

const deleteNotes = (folder_id: number) => {
    try {
        const query = db.prepare("DELETE FROM notes WHERE folder_id = ?")
        query.run(folder_id)
        return true
    } catch (err) {
        console.error(err)
        throw err
    }
}

export {
    createTables,
    getFolders,
    getSingleFolder,
    addFolder,
    editFolder,
    deleteFolder,
    checkNameExists,
    checkSubFolders,
    checkFolderDepth,
    getNotes,
    addNote,
    editNote,
    deleteNotes,
}