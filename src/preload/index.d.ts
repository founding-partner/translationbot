import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      handleUpdates: (callback: (event: IpcRendererEvent, ...args: unknown[]) => void) => void
      handleAuth: (callback: (event: IpcRendererEvent, ...args: unknown[]) => void) => void
      publishCommands: (command: string) => void
    }
  }
}
