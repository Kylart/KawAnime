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
      .pause(500)
      .getText('.button-container .button').should.eventually.equal('DOWNLOAD')
      .isExisting('.input-container').should.eventually.be.true
      .isExisting('.quality-container').should.eventually.be.true
      .isExisting('.left').should.eventually.be.true
      .isExisting('.right').should.eventually.be.true
      .$('.input-container:nth-child(1) input').addValue('Sakura Trick')
      .keys([ 'Tab' ])
      .$('.input-container:nth-child(2) input').hasFocus().should.eventually.be.true
      .$('.input-container:nth-child(2) input').addValue('4')
      .keys([ 'Tab' ])
      .$('.input-container:nth-child(3) input').hasFocus().should.eventually.be.true
      .$('.input-container:nth-child(3) input').addValue('8')
      .keys([ 'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowRight' ]) // Should select 1080p quality
      .$('.quality-container div[role="radiogroup"] div:nth-child(4) input').hasFocus().should.eventually.be.true
      .keys([ 'Tab', 'Enter' ])
      .waitUntil(() => this.app.client.$('#magnet-modal').isVisible())
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
