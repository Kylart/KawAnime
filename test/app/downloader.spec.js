module.exports = function () {
  describe('Downloader modal', function () {
    it('should open the downloader modal', function () {
      return this.app.client
        .$('#downloader-btn').click()
        .pause(500)
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
        .keys([ 'Tab', 'Enter' ])
        .waitUntil(() => this.app.client.$('#magnet-modal').isVisible())
        .isVisible('.quality-container').should.be.eventually.be.false
        .isVisible('.left').should.be.eventually.be.false
        .isVisible('.right').should.be.eventually.be.false
        .pause(500)
    })

    it('should open the magnet modal with the correct magnets', function () {
      return this.app.client
        .getText('#magnet-modal').should.eventually.include('Results for Sakura Trick')
        .getText('#magnet-modal li > div:nth-child(1)').should.eventually.include('Sakura Trick')
        .$('#magnet-modal li > div:nth-child(1)').click()
        .waitUntil(async () => (await this.app.client.$('#magnet-modal li:nth-child(1)').getAttribute('aria-expanded')) === 'true')
        .isExisting('#magnet-modal li:nth-child(1) > div:nth-child(2) > div:nth-child(6)').should.eventually.be.true
        .getText('#magnet-modal li:nth-child(1) > div:nth-child(2) > div:nth-child(6)').should.eventually.include('Sakura Trick - Ep. 4')
        .getText('#magnet-modal li:nth-child(1) > div:nth-child(2) > div:nth-child(2)').should.eventually.include('Sakura Trick - Ep. 8')
        .getText('#magnet-modal li:nth-child(1) > div:nth-child(2) > div:nth-child(3)').should.eventually.include('Sakura Trick - Ep. 7')
    })

    it('should close the magnet modal when hitting the escape key', function () {
      return this.app.client
        .$('body').keys([ 'Escape' ])
        .pause(500)
        .isVisible('#magnet-modal').should.eventually.be.false
    })
  })
}
