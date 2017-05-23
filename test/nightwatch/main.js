/**
 * Created by Kylart on 23/05/2017.
 */

import Nuxt from 'nuxt'
import http from 'http'
import initFile from '../../assets/scripts/init/main.js'
import colors from 'colors' // eslint-disable-line
import {resolve} from 'path'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null
let server = null
const uri = 'http://localhost:4000'

module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser, done) {
    /**
     * Nuxt config
     */
    const rootDir = resolve(__dirname, '..', '..')
    let config = {}
    try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
    config.rootDir = rootDir // project folder
    config.dev = false // production build

    /**
     * Server config
     */
    nuxt = new Nuxt(config)
    const route = initFile.route(nuxt)
    server = http.createServer(route)
    nuxt.build().then(() => {
      server.listen(4000)
      console.log(`KawAnime's server is at http://localhost:${server.address().port}`.green)
      done()
    })
  },
  'Guinea Pig Assert Title': function (browser) {
    browser
      .url(uri)
      .waitForElementVisible('body')
      .assert.title('KawAnime')
      .end()
  },
  after: function () {
    server.close()
    nuxt.close()
  }
}
