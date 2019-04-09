import { BrowserWindow } from 'electron'

export default function (eventName, data) {
  BrowserWindow.getAllWindows()
    .forEach((win) => {
      win.webContents.send(eventName, data)
    })
}
