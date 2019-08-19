module.exports = function () {
  describe('Downloader modal', function () {
    it('should open on click', function () {
      return this.app.client
        .$('.toolbar > div > *:nth-child(8)').click()
        .pause(500).saveScreenshot('test/screenshots/downloader_modal.png')
        .getText('.button-container .button').should.eventually.equal('DOWNLOAD')
        .isExisting('.input-container').should.eventually.be.true
        .isExisting('.quality-container').should.eventually.be.true
        .isExisting('.left').should.eventually.be.true
        .isExisting('.right').should.eventually.be.true
    })

    it('should fill in the form and show the magnet modal', function () {
      return this.app.client
        .$('.input-container:nth-child(1) input').addValue('Sakura Trick')
        .keys([ 'Tab' ])
        .$('.input-container:nth-child(2) input').hasFocus().should.eventually.be.true
        .$('.input-container:nth-child(2) input').addValue('4')
        .keys([ 'Tab' ])
        .$('.input-container:nth-child(3) input').hasFocus().should.eventually.be.true
        .$('.input-container:nth-child(3) input').addValue('8')
        .keys([ 'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowRight' ]) // Should select 1080p quality
        .$('.quality-container div[role="radiogroup"] div:nth-child(4) input').hasFocus().should.eventually.be.true
        .saveScreenshot('test/screenshots/downloader_modal_filled.png')
        .keys([ 'Tab', 'Enter' ])
        .waitUntil(() => this.app.client.$('#magnet-modal').isVisible(), 10000)
        .pause(500)
        .isVisible('.quality-container').should.eventually.be.false
        .isVisible('.left').should.eventually.be.false
        .isVisible('.right').should.eventually.be.false
        .pause(500)
    })

    it('should open the magnet modal with the correct magnets', function () {
      return this.app.client
        .saveScreenshot('test/screenshots/downloader_results.png')
        .getText('#magnet-modal').should.eventually.include('Results for Sakura Trick')
        .$('#magnet-modal div:nth-child(3) > div > div > button').click()
        .waitUntil(async () => (await this.app.client.$('#magnet-modal div:nth-child(3) > div > div').getAttribute('aria-expanded')) === 'true')
        .pause(500)
        .saveScreenshot('test/screenshots/downloader_results_expanded.png')
        .getText('#magnet-modal > div:nth-child(3) > div > div > div > div > div:nth-child(5)').should.eventually.include('Sakura Trick - Ep. 4')
        .getText('#magnet-modal > div:nth-child(3) > div > div > div > div > div:nth-child(1)').should.eventually.include('Sakura Trick - Ep. 8')
        .getText('#magnet-modal > div:nth-child(3) > div > div > div > div > div:nth-child(2)').should.eventually.include('Sakura Trick - Ep. 7')
    })

    it('should close the magnet modal when hitting the escape key', async function () {
      return this.app.client
        .$('#magnet-modal > div:nth-child(4) > button').click()
        .pause(500)
        .isVisible('#magnet-modal').should.eventually.be.false
    })
  })
}
