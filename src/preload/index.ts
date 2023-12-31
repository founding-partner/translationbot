import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  handleUpdates: (callback: (event: IpcRendererEvent, ...args: unknown[]) => void): void => {
    ipcRenderer.on('translation', callback)
  },
  handleAuth: (callback: (event: IpcRendererEvent, ...args: unknown[]) => void): void => {
    ipcRenderer.on('token', callback)
  },
  publishCommands: (command: string): void => {
    ipcRenderer.send('commands', command)
  }
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
