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
      args: ['dist/bundled/background.js']
    })

    await this.app.start()
  })

  beforeEach(function () {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  })

  after(async function () {
    const rendererLogs = await this.app.client.getRenderProcessLogs()
    const mainLogs = await this.app.client.getMainProcessLogs()

    console.log('RENDERER LOGS')
    rendererLogs.forEach((log) => console.log(log))

    console.log('MAIN LOGS')
    mainLogs.forEach((log) => console.log(log))

    return this.app.stop()
  })
}
