import { autoUpdater } from 'electron-updater'

import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { sendToWindows } from '../../externals'

const events = eventsList.update
const logger = new Logger('Update')

autoUpdater.on('update-available', () => {
  logger.info('Update available.')

  sendToWindows(events.available.success)
})

autoUpdater.on('error', (err) => {
  logger.error('Error while checking for update.', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  sendToWindows(events.progress.success, progressObj)
})

autoUpdater.on('update-downloaded', () => {
  logger.info('Update fully downloaded and installable.')

  sendToWindows(events.installable.success)
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
