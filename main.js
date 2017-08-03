require('colors')
const fs = require('fs')
const path = require('path')
const http = require('http')
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

const server = http.createServer(app).listen()
const _APP_URL_ = 'http://localhost:' + server.address().port
console.log(`> KawAnime is at ${_APP_URL_}`.green)

/*
 ** Electron app
 */
const {BrowserWindow, dialog, Menu} = require('electron')
const Electron = require('electron').app
const url = require('url')

const menuFile = require(path.join(__dirname, 'assets', 'menu.js'))
const menu = Menu.buildFromTemplate(menuFile.menu)

let win = null // Current window

const pollServer = () => {
  http.get(_APP_URL_, ({statusCode}) => {
    statusCode !== 200
      ? setTimeout(pollServer, 300)
      : win.loadURL(_APP_URL_)
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
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    frame: process.platform === 'darwin',
    show: false
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('crashed', (event) => {
    console.error('Main window crashed')
    console.error('Event is ' + event)
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
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  pollServer()
}

Electron.on('ready', () => {
  Menu.setApplicationMenu(menu)

  newWin()

  process.win = win
  process.appURL = _APP_URL_
})

// Quit when all windows are closed.
Electron.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    server.close()
    Electron.quit()
  }
})

Electron.on('activate', () => win === null && newWin())
