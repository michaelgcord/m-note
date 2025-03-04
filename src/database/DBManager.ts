import Database from 'better-sqlite3'
// import join from 'path'

// const dbPath = process.env.NODE_ENV === 'development'
//     ? "./app.db"
//     : join(process.resourcesPath, './app.db')


const db = new Database('app.db')
db.pragma("journal_mode = WAL")

export default db