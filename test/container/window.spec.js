module.exports = function () {
  describe('General window behaviour', function () {
    it('should be visible', function () {
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
}
