require('colors')
const fs = require('fs')
const {homedir} = require('os')
const path = require('path')
const http = require('http')
const axios = require('axios')
const LRU = require('lru-cache')
const express = require('express')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')
const redirects = require(path.join(__dirname, '/router/301.json'))

const isDev = process.env.NODE_ENV === 'development'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

const template = fs.readFileSync(path.join(__dirname, 'assets/index.template.html'), 'utf-8')

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve(__dirname, 'public'),
    // performance
    runInNewContext: false
  }))
}

let renderer
let readyPromise
if (!isDev) {
  const bundle = require(path.join(__dirname, 'public', 'vue-ssr-server-bundle.json'))
  const clientManifest = require(path.join(__dirname, 'public', 'vue-ssr-client-manifest.json'))
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  // hot reload
  readyPromise = require(path.join(__dirname, 'webpack', 'setup-dev-server.js'))(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && !isDev ? 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use('/static', serve(path.join(__dirname, 'static'), true))
app.use('/public', serve(path.join(__dirname, 'public'), true))

// Setup the api
require(path.join(__dirname, 'server'))(app)

// 301 redirect for changed routes
Object.keys(redirects).forEach((k) => {
  app.get(k, (req, res) => res.redirect(301, redirects[k]))
})

// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
const microCache = LRU({
  max: 100,
  maxAge: 1000
})

const isCacheable = req => useMicroCache

function render ({url}, res) {
  const s = Date.now()

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', serverInfo)

  const handleError = (err) => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end(`<pre>500 | Internal Server Error\n${err.stack}</pre>`)
      console.error(`error during render : ${url}`)
      console.error(err.stack)
    }
  }

  const cacheable = isCacheable(url)
  if (cacheable) {
    const hit = microCache.get(url)
    if (hit) {
      isDev && console.log(`> cache hit!`.green)
      return res.end(hit)
    }
  }

  const context = {
    title: 'KawAnime',
    url
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.end(html)
    if (cacheable) {
      microCache.set(url, html)
    }
    isDev && console.log(`> whole request: ${Date.now() - s}ms`.green)
  })
}

app.get('*', !isDev ? render : (req, res) => {
  readyPromise.then(() => {
    render(req, res)
  })
})

/*
 ** Electron app
 */
const {BrowserWindow, dialog, Menu, Tray} = require('electron')
const Electron = require('electron').app
const url = require('url')
const localConfig = require(path.join(homedir(), '.KawAnime', 'config.json')).config

const menuFile = require(path.join(__dirname, 'assets', 'menu.js'))
const menu = Menu.buildFromTemplate(menuFile.menu)

process.win = null // Current window
let tray = null
let _APP_URL_
let server

const startServer = () => {
  server = http.createServer(app).listen()
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

// Disable error dialogs by overriding
dialog.showErrorBox = (title, content) => {
  console.log(`${title}\n${content}`)
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception occurred in main process.\n', err)
})

const newWin = () => {
  startServer()

  process.win = new BrowserWindow({
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
    console.error('Event is ' + event)
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

Electron.on('ready', () => {
  const installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })

  const currentSettings = Electron.getLoginItemSettings()
  Menu.setApplicationMenu(menu)

  if (localConfig.system.toTray) {
    if (process.platform === 'darwin') {
      Electron.dock.hide()
    }
    tray = new Tray(path.join(__dirname, 'static', 'images', 'tray.png'))
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
  const {username} = require('os').userInfo()
  const tokenPath = path.join(require('os').homedir(), '.KawAnime', '_token')
  const token = fs.readFileSync(tokenPath, 'utf-8')
  axios.post('https://kawanime.com/_api', {
    id: `${username}/${token}`
  })
    .catch((err) => { console.error('Couldn\'t reach KawAnime.com\'s api:', err) })
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

Electron.on('activate', () => {
  process.win === null
    ? newWin()
    : process.win.show()
})
