const {join} = require('path')

// Init files and directories
const initFile = require(join(__dirname, 'assets', 'scripts', 'init', 'main.js'))

/**
 *  Nuxt.js part
 */
const http = require('http')
const Nuxt = require('nuxt')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
config.rootDir = __dirname // for electron-builder

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Initiate routes.
const route = initFile.route(nuxt)
const server = http.createServer(route)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
      .catch((error) => {
        console.error(error) // eslint-disable-line no-console
        process.exit(1)
      })
}

// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`KawAnime is at ${_NUXT_URL_}`)

/*
 ** Electron app
 */
const {Menu, app, BrowserWindow, dialog} = require('electron')
const url = require('url')

const menuFile = require(join(__dirname, 'assets', 'scripts', 'menu.js'))
const menu = Menu.buildFromTemplate(menuFile.menu)

let win = null // Current window

const POLL_INTERVAL = 300
const pollServer = () => {
  http.get(_NUXT_URL_, ({statusCode}) => {
    statusCode !== 200
        ? setTimeout(pollServer, POLL_INTERVAL)
        : win.loadURL(_NUXT_URL_)
  })
      .on('error', pollServer)
}

// Disable error dialogs by overriding
dialog.showErrorBox = (title, content) => {
  console.log(`${title}\n${content}`)
}

const newWin = () => {
  win = new BrowserWindow({
    width: config.electron.width,
    height: config.electron.height,
    titleBarStyle: 'hidden',
    show: false
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  !config.dev
      ? win.loadURL(_NUXT_URL_)
      : win.loadURL(url.format({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      }))

  win.on('closed', () => {
    win = null
  })

  pollServer()
}

app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.setAboutPanelOptions({
      applicationName: 'KawAnime',
      applicationVersion: '0.4.0',
      copyright: 'Kylart 2016-2017'
    })
  }

  Menu.setApplicationMenu(menu)

  // Dev tools
  if (config.dev) {
    require('devtron').install()
  }

  newWin()

  process.win = win
  process.nuxtURL = _NUXT_URL_
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => win === null && newWin())
