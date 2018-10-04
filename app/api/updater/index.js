module.exports = (app, routes) => {
  const { join } = require('path')
  const { autoUpdater } = require('electron-updater')
  let isUpdateAvailable = false
  let isInstallable = false
  let downloadProgress
  let error

  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.transports.console.level = false // There is no need to log this in the console.
  autoUpdater.logger.transports.file.level = 'silly'
  autoUpdater.logger.transports.file.file = join(require('../utils').dir, 'error-update.log')

  autoUpdater.on('update-available', () => {
    isUpdateAvailable = true
  })

  autoUpdater.on('update-not-available', () => {
    isUpdateAvailable = false
  })

  autoUpdater.on('error', (err) => {
    error = err
  })

  autoUpdater.on('download-progress', (progressObj) => {
    downloadProgress = progressObj
  })

  autoUpdater.on('update-downloaded', () => {
    isInstallable = true
  })

  autoUpdater.checkForUpdates()

  routes.push(
    (app) => {
      app.get('/_isUpdateAvailable', (req, res) => {
        !isUpdateAvailable && autoUpdater.checkForUpdates()
        res.send({
          ok: isUpdateAvailable,
          data: error
        })
      })
    },
    (app) => {
      app.get('/_isInstallable', (req, res) => {
        res.send({
          ok: isInstallable,
          progress: downloadProgress
        })
      })
    },
    (app) => {
      app.get('/_quitAndInstall', () => {
        autoUpdater.quitAndInstall()
      })
    }
  )

  return routes
}
