import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendNotification: (options: { title: string; body: string }) => void
    }
  }
}
