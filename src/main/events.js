import { BrowserWindow, app } from 'electron'

import { sendToWindows } from './externals'
import { eventsList } from 'vendor'

function open (e, args) {
  e && e.preventDefault()

  const hasWin = BrowserWindow.getAllWindows().length

  if (!hasWin) {
    app.on('web-contents-created', (e, webContents) => {
      webContents.once('dom-ready', () => {
        sendToWindows(eventsList.externalOpen.success, Array.isArray(args) ? args : [args])
      })
    })

    return
  }

  sendToWindows(eventsList.externalOpen.success, Array.isArray(args) ? args : [args])

  setTimeout(() => {
    BrowserWindow.getAllWindows()[0].focus()
  }, 100)
}

export default open
