/**
 * Created by Kylart on 23/05/2017.
 */

require('colors')
const {readdirSync, unlinkSync, rmdirSync} = require('fs')
const {join} = require('path')
const {userInfo} = require('os')

// We keep the nuxt and server instance
// So we can close them at the end of the test
let server = null
const uri = 'http://localhost:4000'

const DIR = join(userInfo().homedir, '.KawAnime-test')

module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser, done) {
    /**
     * Server config
     */
    done()

    console.log(`KawAnime's server is at http://localhost:${uri}`.green)
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
