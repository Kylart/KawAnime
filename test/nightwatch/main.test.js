/**
 * Created by Kylart on 23/05/2017.
 */

import 'colors'
import Nuxt from 'nuxt'
import http from 'http'
import {readdirSync, unlinkSync, rmdirSync} from 'fs'
import {resolve, join} from 'path'
import {userInfo} from 'os'

process.env.NODE_ENV = 'KawAnime-test'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null
let server = null
const uri = 'http://localhost:4000'

const DIR = join(userInfo().homedir, '.KawAnime-test')

module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser, done) {
    /**
     * Creating .KawAnime-test directory and necessary files
     */
    const initFile = require(join(__dirname, '..', '..', 'assets', 'api', 'main.js'))

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
  'Getting downloader page and downloading some anime': function (client) {
    client
      .url(`${uri}/downloader`)
      .waitForElementVisible('body')
      .assert.title('Downloader - KawAnime')
      .assert.visible('div.config-modal')
      .assert.visible('div.form-container')
      .assert.visible('div.choose-magnets .input-group__input')
      .click('div.choose-magnets .input-group__input')
      .assert.visible('input[name="name-input"]')
      .click('input[name="name-input"]')
      .setValue('input[name="name-input"]', 'rewrite')
      .assert.visible('input[name="from-ep-input"]')
      .click('input[name="from-ep-input"]')
      .setValue('input[name="from-ep-input"]', '3')
      .assert.visible('input[name="until-ep-input"]')
      .click('input[name="until-ep-input"]')
      .setValue('input[name="until-ep-input"]', '9')
      .assert.visible('#download-btn')
      .click('#download-btn')
      .waitForElementVisible('div.modal-text')
      .end()
  },
  'Getting season page': function (client) {
    client
      .url(`${uri}/seasons`)
      .waitForElementVisible('body')
      .assert.title('Seasons - KawAnime')
      .end()
  },
  after: function () {
    server.close()
    nuxt.close()

    /**
     * Removing temporary .KawAnime directory
     */
    console.info('Removing temporary info'.yellow)
    const files = readdirSync(DIR)

    files.forEach((file) => {
      unlinkSync(`${DIR}/${file}`)
    })

    try {
      rmdirSync(DIR)
    } catch (err) {
      throw err
    }

    console.info('All clear!'.green)
  }
}
