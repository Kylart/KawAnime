// const test = require('ava')

// A simple test to verify a visible window is opened with a title
var Application = require('spectron').Application
var electron = require('electron')
var assert = require('assert')

describe('Launch app', function () {
  this.timeout(10000)

  before(async function () {
    this.app = new Application({
      path: electron,
      args: ['dist/bundled/background.js']
    })

    return this.app.start()
  })

  after(async function () {
    this.app.stop()
  })

  it('should be visible', async function () {
    const isVisible = await this.app.browserWindow.isVisible()

    assert.strictEqual(true, isVisible)
  })
})
