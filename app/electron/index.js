/**
 * The idea is to show a dummy window in dev while
 * the server is not ready yet. Hence, we have to ping
 * the server's supposed address at regular interval.
 */

const { homedir } = require('os')
const { join } = require('path')
const fs = require('fs')
const http = require('http')

const { app, BrowserWindow, dialog, Menu, Tray } = require('electron')
const url = require('url')

const systemFolder = join(homedir(), '.KawAnime')

const userConfig = require(join(systemFolder, 'config.json')).config
const serverConfig = require('../config.js')

const menuFile = require('./resources/menu.js')
const menu = Menu.buildFromTemplate(menuFile.menu)

const isDev = process.env.NODE_ENV === 'development'
const PORT = process.env.PORT || serverConfig.port

const _APP_URL_ = `http://localhost:${PORT}`

let win = null
let tray = null

/**
 * Util methods
 */

function pollServer () {
  http.get(_APP_URL_, ({ statusCode }) => {
    statusCode !== 200
      ? setTimeout(pollServer, 300)
      : win.loadURL(_APP_URL_)
  })
    .on('error', pollServer)
}

function newWin () {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    },
    width: userConfig.bounds.width
      ? userConfig.bounds.width
      : 1200,
    height: userConfig.bounds.height
      ? userConfig.bounds.height
      : 800,
    titleBarStyle: 'hidden',
    frame: process.platform === 'darwin',
    show: false
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('close', () => {
    const bounds = win.getBounds()
    const config = join(systemFolder, 'config.json')
    fs.readFile(config, 'utf-8', (error, data) => {
      if (error) {
        // failed to read file
      } else {
        const json = JSON.parse(data)
        json.config.bounds = bounds
        fs.writeFileSync(config, JSON.stringify(json), 'utf-8')
      }
    })
  })

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('crashed', (event) => {
    console.error('Main window crashed')
    console.error('Event is ', event)
  })

  win.on('unresponsive', () => {
    console.warn('Main window is unresponsive...')
  })

  win.on('session-end', () => {
    console.info('Session logged off.')
  })

  if (!isDev) {
    return win.loadURL(_APP_URL_)
  } else {
    win.loadURL(url.format({
      pathname: join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  pollServer()
}

/**
 * Setting up electron events and action.
 */

// Disable error dialogs by overriding
dialog.showErrorBox = (title, content) => {
  console.log(`${title}\n${content}`)
}

app.on('ready', () => {
  const currentSettings = app.getLoginItemSettings()
  Menu.setApplicationMenu(menu)

  // Devtools
  if (isDev) {
    require('vue-devtools').install()
  }

  if (userConfig.system.toTray) {
    if (process.platform === 'darwin') {
      app.dock.hide()
    }
    tray = new Tray('./resources/tray.png')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'New window',
        click: () => {
          win === null
            ? newWin()
            : win.show()
        },
        accelerator: 'CommandOrControl+N'
      },
      { label: 'Show current window', click: () => { win.show() } },
      { label: 'Close current window', role: 'close', accelerator: 'CommandOrControl+W' },
      { type: 'separator' },
      { label: 'Quit', role: 'quit', accelerator: 'CommandOrControl+Q' }
    ])
    tray.setToolTip('The ultimate otaku software.')
    tray.setContextMenu(contextMenu)
  }

  if (userConfig.system.autoStart) {
    app.setLoginItemSettings({
      openAtLogin: true
    })
  } else {
    if (currentSettings.openAtLogin) {
      app.setLoginItemSettings({
        openAtLogin: false
      })
    }
  }

  newWin()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    if (!tray) {
      app.quit()
    }
  }
})

app.on('quit', () => {
  // We remove logs files every once in a while
  const dir = require(join(__dirname, '..', 'api', 'utils', 'dir.js'))

  const filesToCheck = ['logs.log', 'error.log']

  filesToCheck.forEach((file) => {
    const filePath = join(dir, file)

    fs.stat(filePath, (err, stats) => {
      if (!err) {
        const size = stats.size / 1000000.0

        if (size > 5) {
          fs.unlinkSync(filePath)
        }
      }
    })
  })
})

app.on('activate', () => {
  win === null
    ? newWin()
    : win.show()
})
