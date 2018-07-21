require('colors')
const fs = require('fs')
const path = require('path')
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

const template = fs.readFileSync(path.join(__dirname, 'assets', 'index.template.html'), 'utf-8')

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
    basedir: resolve(__dirname, '..', '..', 'public'),
    // performance
    runInNewContext: false
  }))
}

let renderer
let readyPromise

process.app = express()

if (!isDev) {
  const bundle = require(path.join(__dirname, 'public', 'vue-ssr-server-bundle.json'))
  const clientManifest = require(path.join(__dirname, 'public', 'vue-ssr-client-manifest.json'))
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  // hot reload
  readyPromise = require(path.join(__dirname, '..', '..', 'webpack', 'setup-dev-server.js'))(process.app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && !isDev ? 60 * 60 * 24 * 30 : 0
})

process.app.use(compression({
  threshold: 0,
  filter (req, res) {
    return res.getHeader('Content-Type') === 'text/event-stream'
      ? false
      : compression.filter(req, res)
  }
}))
process.app.use('/static', serve(path.join(__dirname, 'static'), true))
process.app.use('/public', serve(path.join(__dirname, 'public'), true))

// Setup the api
// TODO: Move this call to main/index.js would be great
require(path.join(__dirname, '..', 'main', 'server'))(process.app)

// 301 redirect for changed routes
Object.keys(redirects).forEach((k) => {
  process.app.get(k, (req, res) => res.redirect(301, redirects[k]))
})

// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
const microCache = LRU({
  max: 100,
  maxAge: 1000
})

const isCacheable = req => useMicroCache

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

  const cacheable = isCacheable(url)
  if (cacheable) {
    const hit = microCache.get(url)
    if (hit) {
      isDev && console.log('> cache hit!')
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
    isDev && console.log(`> whole request: ${Date.now() - s}ms`)
  })
}

process.app.get('*', !isDev ? render : (req, res) => {
  readyPromise.then(() => {
    render(req, res)
  })
})
