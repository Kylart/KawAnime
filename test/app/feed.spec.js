module.exports = function () {
  describe('Release page', function () {
    it('should be loading at first', function () {
      return this.app.client
        .isVisible('.loader-container').should.eventually.be.true
    })

    it('should have some entries', function () {
      return this.app.client
        .saveScreenshot('test/screenshots/feed_loader.png')
        .waitUntil(async () => (await this.app.client.isVisible('.loader-container')) === false, 30000)
        .pause(500)
        .isVisible('.container > .pag-container').should.eventually.be.true
        .$$('#release-entry').should.eventually.have.length(12)
        .getText('.time').should.eventually.equal('Updated a few seconds ago')
    })

    it('should show buttons on card hover', function () {
      for (let i = 2; i < 14; ++i) {
        this.app.client
          .moveToObject(`#release-entry > div:nth-child(${i})`)
          .pause(500)
          .$(`#release-entry > div:nth-child(${i}) > div > div`).getText()
          .should.eventually.include('play_arrow')
          .and.include('file_download')
          .and.include('cloud_download')
          .and.include('more_horiz')
      }
    })

    it('should take a final screenshot', function () {
      return this.app.client.saveScreenshot('test/screenshots/feed.png')
    })
  })
}
