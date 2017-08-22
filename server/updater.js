module.exports = (app, routes) => {
  const {autoUpdater} = require('electron-updater')
  let isUpdateAvailable = false
  let error

  autoUpdater.on('update-available', (info) => {
    isUpdateAvailable = true
  })

  autoUpdater.on('update-not-available', (info) => {
    isUpdateAvailable = false
  })

  autoUpdater.on('error', (err) => {
    error = err
  })

  autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.quitAndInstall()
  })

  autoUpdater.checkForUpdates()

  routes.push(
    (app) => {
      app.get('/_isUpdateAvailable', async (req, res) => {
        res.send({
          ok: isUpdateAvailable,
          data: error
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
