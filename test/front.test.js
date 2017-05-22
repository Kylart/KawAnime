/**
 * Created by Kylart on 21/05/2017.
 */

const Application = require('spectron').Application
const assert = require('assert')
const {join} = require('path')

// Application is not signed yet so we have 2 windows on mac OS...
describe('Application starting', function () {
  this.timeout(10 * 1000)

  beforeEach(function () {
    this.app = new Application({
      path: join(__dirname, '..', 'node_modules', '.bin',
        'electron'),
      args: [join(__dirname, '..')]
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
})
