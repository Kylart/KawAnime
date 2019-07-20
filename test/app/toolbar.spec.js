module.exports = function () {
  describe('Toolbar', function () {
    it('is formed as expected', function () {
      return this.app.client
        .$('nav.toolbar').isVisible().should.eventually.be.true
        .getText('nav.toolbar > div > button:nth-child(1)').should.eventually.equal('menu')
        .getText('nav.toolbar > div > div:nth-child(2)').should.eventually.equal('かわニメ')
        .$('nav.toolbar > div > div:nth-child(3)').getAttribute('class').should.eventually.equal('spacer')
        .getText('nav.toolbar > div > div:nth-child(4)').should.eventually.equal('search')
        .getText('nav.toolbar > div > div:nth-child(5)').should.eventually.equal('file_download')
        .getText('nav.toolbar > div > div:nth-child(6)').should.eventually.equal('settings')
        .getText('nav.toolbar > div > *:last-child').should.eventually.equal('fiber_new')
    })

    it('should be able to open the drawer', function () {
      return this.app.client
        .$('nav.toolbar > div > button:nth-child(1)').click()
        .waitUntil(async () => this.app.client.$('aside.drawer').isVisible())
        .isVisible('.v-overlay').should.eventually.be.true
        .$('.v-overlay').click()
        .waitUntil(async () => (await this.app.client.isExisting('.v-overlay')) === false)
    })
  })
}
