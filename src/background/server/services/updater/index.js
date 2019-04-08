import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'

import { eventsList } from '../../../../vendor'
import { Logger } from '../../utils'

const events = eventsList.update
const logger = new Logger('Update')

function sendToWIndows (eventName, data) {
  BrowserWindow.getAllWindows()
    .forEach((win) => {
      win.webContents.send(eventName, data)
    })
}

autoUpdater.on('update-available', () => {
  logger.info('Update available.')

  sendToWIndows(events.available.success)
})

autoUpdater.on('error', (err) => {
  logger.error('Error while checking for update.', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  sendToWIndows(events.progress.success, progressObj)
})

autoUpdater.on('update-downloaded', () => {
  logger.info('Update fully downloaded and installable.')

  sendToWIndows(events.installable.success)
})

function install () {
  logger.info('Restarting to update...')

  autoUpdater.quitAndInstall()
}

autoUpdater.checkForUpdates()

// Checking for updates every 10 minutes
setInterval(autoUpdater.checkForUpdates, 10 * 60 * 1000)

export default {
  eventName: events.install.main,
  handler: install
}
