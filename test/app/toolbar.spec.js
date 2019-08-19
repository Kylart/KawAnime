module.exports = function () {
  describe('Toolbar', function () {
    it('is formed as expected', function () {
      return this.app.client
        .$('.toolbar').isVisible().should.eventually.be.true
        .getText('.toolbar > div > *:nth-child(1)').should.eventually.equal('chevron_right')
        .getText('.toolbar > div > *:nth-child(2)').should.eventually.equal('かわニメ')
        .$('.toolbar > div > *:nth-child(3)').getAttribute('class').should.eventually.equal('spacer')
        .getText('.toolbar > div > *:nth-child(5)').should.eventually.equal('search')
        .getText('.toolbar > div > *:nth-child(8)').should.eventually.equal('file_download')
        .getText('.toolbar > div > *:nth-child(10)').should.eventually.equal('settings')
        .getText('.toolbar > div > *:last-child').should.eventually.equal('fiber_new')
        .pause(500)
    })

    it.skip('should be able to expand the drawer', function () {
      return this.app.client
        .$('.toolbar > div > *:nth-child(1)').click()
        .waitUntil(async () => this.app.client.$('aside.drawer').isVisible())
        .isVisible('.v-overlay').should.eventually.be.true
        .$('.v-overlay').click()
        .waitUntil(async () => (await this.app.client.isExisting('.v-overlay')) === false)
    })
  })
}
