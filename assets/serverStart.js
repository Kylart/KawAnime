/**
 * Created by Kylart on 19/06/2017.
 */

'use strict'

process.NODE_ENV = 'development'

const {join} = require('path')
const Nuxt = require('nuxt')
const http = require('http')
const chokidar = require('chokidar')

let nuxt = null
let server = null

const initServer = async () => {
  const initFile = require(join(__dirname, 'api', 'main.js'))

  /**
   * Nuxt config
   */
  const config = require('../nuxt.config.js')

  /**
   * Server config
   */
  nuxt = new Nuxt(config)
  const route = initFile.route(nuxt)
  server = http.createServer(route)

  try {
    await nuxt.build()
  } catch (e) {
    void e

    setTimeout(initServer.catch(e => void e), 300)
  }

  server.listen(3000)
}

initServer().catch((err) => { void err })

chokidar.watch(__dirname, {ignored: './menu.js'}).on('all', (event, path) => {
  console.info(`${path}: ${event}`)

  server.close()

  initServer().catch((err) => { void err })
})
