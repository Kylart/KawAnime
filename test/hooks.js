const { Application } = require('spectron')
const electron = require('electron')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.should()
chai.use(chaiAsPromised)

module.exports = function () {
  before(async function () {
    this.app = new Application({
      path: electron,
      args: ['dist/bundled/background.js'],
      webdriverOptions: {
        deprecationWarnings: false
      }
    })

    await this.app.start()
  })

  beforeEach(function () {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness

    this.app.browserWindow.focus()
  })

  after(async function () {
    return this.app.stop()
  })
}
