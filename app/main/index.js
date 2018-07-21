const fs = require('fs')
const {homedir, userInfo} = require('os')
const path = require('path')
const http = require('http')
const axios = require('axios')

const {BrowserWindow, dialog, Menu, Tray} = require('electron')
const Electron = require('electron').app
const url = require('url')
const localConfig = require(path.join(homedir(), '.KawAnime', 'config.json')).config

const menuFile = require('./resources/menu.js')
const menu = Menu.buildFromTemplate(menuFile.menu)

const isDev = process.env.NODE_ENV === 'development'

process.win = null // Current window
let tray = null
let _APP_URL_
let server

const startServer = () => {
  const app = process.app

  server = http.createServer(app).listen(process.env.PORT)
  _APP_URL_ = 'http://localhost:' + server.address().port
  console.log(`> KawAnime is at ${_APP_URL_}`.green)

  process.appURL = _APP_URL_
}

const pollServer = () => {
  http.get(_APP_URL_, ({statusCode}) => {
    statusCode !== 200
      ? setTimeout(pollServer, 300)
      : process.win.loadURL(_APP_URL_)
  })
    .on('error', pollServer)
}

const newWin = () => {
  if (!process.app) {
    setTimeout(newWin, 500)
    return
  }

  startServer()

  process.win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    },
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    frame: process.platform === 'darwin',
    show: false
  })

  process.win.once('ready-to-show', () => {
    process.win.show()
  })

  process.win.on('closed', () => {
    process.win = null
    if (server.address()) {
      server.close()
    }
  })

  process.win.webContents.on('crashed', (event) => {
    console.error('Main window crashed')
    console.error('Event is ', event)
  })

  process.win.on('unresponsive', () => {
    console.warn('Main window is unresponsive...')
  })

  process.win.on('session-end', () => {
    console.info('Session logged off.')
  })

  if (!isDev) {
    return process.win.loadURL(_APP_URL_)
  } else {
    process.win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  pollServer()
}

// Disable error dialogs by overriding
dialog.showErrorBox = (title, content) => {
  console.log(`${title}\n${content}`)
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception occurred in main process.\n', err)
})

Electron.on('ready', () => {
  const currentSettings = Electron.getLoginItemSettings()
  Menu.setApplicationMenu(menu)

  // Devtools
  if (isDev) {
    require('vue-devtools').install()
  }

  if (localConfig.system.toTray) {
    if (process.platform === 'darwin') {
      Electron.dock.hide()
    }
    tray = new Tray('./resources/tray.png')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'New window',
        click: () => {
          process.win === null
            ? newWin()
            : process.win.show()
        },
        accelerator: 'CommandOrControl+N'
      },
      {label: 'Show current window', click: () => { process.win.show() }},
      {label: 'Close current window', role: 'close', accelerator: 'CommandOrControl+W'},
      {type: 'separator'},
      {label: 'Quit', role: 'quit', accelerator: 'CommandOrControl+Q'}
    ])
    tray.setToolTip('The ultimate otaku software.')
    tray.setContextMenu(contextMenu)
  }

  if (localConfig.system.autoStart) {
    Electron.setLoginItemSettings({
      openAtLogin: true
    })
  } else {
    if (currentSettings.openAtLogin) {
      Electron.setLoginItemSettings({
        openAtLogin: false
      })
    }
  }

  newWin()

  // Let's send some data to kawanime.com/_api
  const {username} = userInfo()
  const tokenPath = path.join(homedir(), '.KawAnime', '_token')
  const token = fs.readFileSync(tokenPath, 'utf-8')
  axios.post('https://kawanime.com/_api', {
    id: `${username}/${token}`
  })
    .catch((err) => { console.error('Couldn\'t reach KawAnime.com\'s api:', err.message) })
})

// Quit when all windows are closed.
Electron.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    if (!tray) {
      server.close()
      Electron.quit()
    }
  }
})

Electron.on('quit', () => {
  // We remove logs files every once in a while
  const dir = require(path.join(__dirname, 'server', 'utils', 'dir.js'))

  const filesToCheck = ['logs.log', 'error.log']

  filesToCheck.forEach((file) => {
    const filePath = path.join(dir, file)

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

Electron.on('activate', () => {
  process.win === null
    ? newWin()
    : process.win.show()
})
