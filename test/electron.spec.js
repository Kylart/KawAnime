const { Application } = require('spectron')
const electron = require('electron')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.should()
chai.use(chaiAsPromised)

describe('Launch app', function () {
  this.timeout(10000)

  before(async function () {
    this.app = new Application({
      path: electron,
      args: ['dist/bundled/background.js']
    })

    await this.app.start()
  })

  beforeEach(function () {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  })

  after(async function () {
    return this.app.stop()
  })

  it('should open the download modal', async function () {
    return this.app.client
      .$('#downloader-btn').click()
      .getText('.button-container .button')
      .should.eventually.equal('DOWNLOAD')
      .isExisting('.quality-container')
      .should.eventually.be.true
      .isExisting('.input-container')
      .should.eventually.be.true
  })

  it('should be visible', async function () {
    return this.app.client
      .getWindowCount()
      .should.eventually.have.at.least(1)
      .browserWindow.isMinimized()
      .should.eventually.be.false.browserWindow.isVisible()
      .should.eventually.be.true.browserWindow.getBounds()
      .should.eventually.have.property('width')
      .and.be.above(0)
      .browserWindow.getBounds()
      .should.eventually.have.property('height')
      .and.be.above(0)
  })
})
