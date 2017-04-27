const path = require('path')

// Init files and directories
const initFile = require(path.join(__dirname, 'assets', 'scripts', 'init', 'main.js'))

/*
 **  Nuxt.js part
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
let win = null // Current window

const http = require('http')
const Nuxt = require('nuxt')

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
config.rootDir = __dirname // for electron-packager

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Initiate routes.
const route = initFile.route(nuxt)
const server = http.createServer(route)

// Build only in dev mode
if (config.dev)
{
  nuxt.build()
      .catch((error) => {
        console.error(error) // eslint-disable-line no-console
        process.exit(1)
      })
}

// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
 ** Electron app
 */
const electron = require('electron')
const Menu = electron.Menu
const url = require('url')

const POLL_INTERVAL = 300
const pollServer = () => {
  http.get(_NUXT_URL_, (res) => {
    const SERVER_DOWN = res.statusCode !== 200
    SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL(_NUXT_URL_)
  })
      .on('error', pollServer)
}

const app = electron.app
const bw = electron.BrowserWindow

const menuFile = require(path.join(__dirname, 'assets', 'scripts', 'menu.js'))
const template = menuFile.menu
const menu = Menu.buildFromTemplate(template)

const newWin = () => {
  win = new bw({
    width: config.electron.width,
    height: config.electron.height,
    titleBarStyle: 'hidden',
    show: false
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if (!config.dev)
  {
    return win.loadURL(_NUXT_URL_)
  }

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => win = null)

  pollServer()
}

app.on('ready', () => {
  app.setAboutPanelOptions({
    applicationName: 'KawAnime',
    applicationVersion: '0.3.0',
    copyright: 'Kylart 2016-2017'
  })

  Menu.setApplicationMenu(menu)

  // Dev tools
  if (config.dev)
  {
    require('devtron').install()
  }

  newWin()

  process.win = win
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin')
  {
    app.quit()
  }
})

app.on('activate', () => win === null && newWin())
