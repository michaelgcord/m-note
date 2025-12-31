import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { 
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
  deleteNote,
  deleteFolderNotes,
} from '../database/DatabaseAPI'

// Custom APIs for renderer
const api = {
  getFolders: getFolders,
  getSingleFolder: getSingleFolder,
  addFolder: addFolder,
  editFolder: editFolder,
  deleteFolder: deleteFolder,
  checkNameExists: checkNameExists,
  checkSubFolders: checkSubFolders,
  checkFolderDepth: checkFolderDepth,
  getNotes: getNotes,
  addNote: addNote,
  editNote: editNote,
  deleteNote: deleteNote,
  deleteFolderNotes: deleteFolderNotes,
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
