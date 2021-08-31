module.exports = function () {
  describe('Downloader modal', function () {
    it('should open on click', function () {
      return this.app.client
        .$('.toolbar > div > *:nth-child(8)').click()
        .pause(500).saveScreenshot('test/screenshots/downloader_modal.png')
        .getText('.downloader button').should.eventually.equal('DOWNLOAD')
        .isExisting('.downloader.background').should.eventually.be.true
        .isExisting('.downloader .qualities').should.eventually.be.true
        .isExisting('.downloader .left').should.eventually.be.true
        .isExisting('.downloader .right').should.eventually.be.true
    })

    it('should fill in the form and show the magnet modal', function () {
      return this.app.client
        .$('.downloader #name').hasFocus().should.eventually.be.true
        .$('.downloader #name').addValue('Vanitas no Carte')
        .keys(['Tab'])
        .$('.downloader #from').hasFocus().should.eventually.be.true
        .$('.downloader #from').addValue('4')
        .keys(['Tab'])
        .$('.downloader #until').hasFocus().should.eventually.be.true
        .$('.downloader #until').addValue('8')
        .keys(['Tab', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowRight']) // Should select 1080p quality
        .$('.qualities div[role="radiogroup"] div:nth-child(4) input').hasFocus().should.eventually.be.true
        .saveScreenshot('test/screenshots/downloader_modal_filled.png')
        .keys(['Tab', 'Enter'])
        .waitUntil(() => this.app.client.$('#magnet-modal').isVisible(), 10000)
        .pause(500)
        .isVisible('.qualities').should.eventually.be.false
        .isVisible('.left').should.eventually.be.false
        .isVisible('.right').should.eventually.be.false
        .pause(500)
    })

    it('should open the magnet modal with the correct magnets', function () {
      return this.app.client
        .saveScreenshot('test/screenshots/downloader_results.png')
        .getText('#magnet-modal').should.eventually.include('Results for Vanitas no Carte')
        .$('#magnet-modal div:nth-child(3) > div > div > button').click()
        .waitUntil(async () => (await this.app.client.$('#magnet-modal div:nth-child(3) > div > div').getAttribute('aria-expanded')) === 'true')
        .pause(500)
        .saveScreenshot('test/screenshots/downloader_results_expanded.png')
        .getText('#magnet-modal > div:nth-child(3) > div > div > div > div > div:nth-child(5)').should.eventually.include('Vanitas no Carte - Ep. 4')
        .getText('#magnet-modal > div:nth-child(3) > div > div > div > div > div:nth-child(1)').should.eventually.include('Vanitas no Carte - Ep. 8')
        .getText('#magnet-modal > div:nth-child(3) > div > div > div > div > div:nth-child(2)').should.eventually.include('Vanitas no Carte - Ep. 7')
    })

    it('should close the magnet modal when hitting the escape key', async function () {
      return this.app.client
        .$('#magnet-modal').click()
        .keys(['Escape']).pause(750)
        .isVisible('#magnet-modal').should.eventually.be.false
    })
  })
}
