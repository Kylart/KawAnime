'use strict'

require('colors')

const api = require('./api')

const path = require('path')
const fs = require('fs')

const express = require('express')
const http = require('http')
const LRU = require('lru-cache')
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer')

const isDev = process.env.NODE_ENV === 'development'
const serverConfig = require('./config.js')
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const redirects = require(path.join(__dirname, '/web/router/301.json'))

const template = fs.readFileSync(path.join(__dirname, 'web', 'assets', 'index.template.html'), 'utf-8')

/**
 * Utils methods
 */

let renderer
let readyPromise

// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
const microCache = LRU({
  max: 100,
  maxAge: 1000
})

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
    basedir: path.resolve(__dirname, '..', 'public'),
    // performance
    runInNewContext: false
  }))
}

function render ({ url }, res) {
  const s = Date.now()

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', serverInfo)

  const handleError = (err) => {
    if (err && err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send(`<pre>500 | Internal Server Error\n${err.stack}</pre>`)
      console.error(`error during render : ${url}`)
      console.error(err.stack)
    }
  }

  const hit = microCache.get(url)

  if (hit) {
    isDev && console.log('> cache hit!')
    return res.end(hit)
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
    microCache.set(url, html)

    isDev && console.log(`> whole request: ${Date.now() - s}ms`)
  })
}

/**
 * Seting up express server
 */

let app = express()

if (isDev) {
  // hot reload
  readyPromise = require(path.join(__dirname, '..', 'webpack', 'setup-dev-server.js'))(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
} else {
  const bundle = require(path.join(__dirname, '..', 'public', 'vue-ssr-server-bundle.json'))
  const clientManifest = require(path.join(__dirname, '..', 'public', 'vue-ssr-client-manifest.json'))
  renderer = createRenderer(bundle, {
    clientManifest
  })
}

const serve = (_path, cache) => express.static(path.resolve(_path), {
  maxAge: cache && !isDev ? 60 * 60 * 24 * 30 : 0
})

app.use(compression({
  threshold: 0,
  filter (req, res) {
    return res.getHeader('Content-Type') === 'text/event-stream'
      ? false
      : compression.filter(req, res)
  }
}))
app.use('/static', serve(path.join(__dirname, 'web', 'static'), true))
app.use('/public', serve(path.join(__dirname, '..', 'public'), true))

// Setup the api
api(app)

// 301 redirect for changed routes
Object.keys(redirects).forEach((k) => {
  app.get(k, (req, res) => res.redirect(301, redirects[k]))
})

app.get('*', !isDev ? render : (req, res) => {
  readyPromise.then(() => {
    render(req, res)
  })
})

// Launching server
const PORT = process.env.PORT || serverConfig.port

http.createServer(app).listen(PORT)

process.appUrl = `http://localhost:${PORT}`

console.log(`\n> KawAnime's server started at ${process.appUrl}!`.green)
