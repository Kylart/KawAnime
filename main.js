require('colors')
const fs = require('fs')
const path = require('path')
const http = require('http')
const LRU = require('lru-cache')
const express = require('express')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')
const redirects = require('./router/301.json')

const isDev = process.env.NODE_ENV === 'development'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

const template = fs.readFileSync(resolve('./assets/index.template.html'), 'utf-8')

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
    basedir: resolve('./public'),
    // performance
    runInNewContext: false
  }))
}

let renderer
let readyPromise
if (!isDev) {
  const bundle = require('./public/vue-ssr-server-bundle.json')
  const clientManifest = require('./public/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  // hot reload
  readyPromise = require('./webpack/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && !isDev ? 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use('/static', serve('./static', true))
app.use('/public', serve('./public', true))
app.use('/static/robots.txt', serve('./robots.txt'))

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'text/xml')
  res.sendFile(resolve('./static/sitemap.xml'))
})

// Setup the api
require('./server')(app)

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
      res.status(500).end('500 | Internal Server Error')
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

const port = process.env.PORT || 9200
const _APP_URL_ = `http://localhost:${port}`
app.listen(port, '0.0.0.0', () => {
  console.log(`> server started at localhost:${port}`.green)
})

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
  console.error('Uncaught exception occurred in main process.\n' + err.message)
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
    app.quit()
  }
})

Electron.on('activate', () => win === null && newWin())
