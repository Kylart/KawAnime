const chai = require('chai')

const should = chai.should()

module.exports = function () {
  describe('Libtorrent bindings', function () {
    this.bindings = null

    it('should successfullly import the bindings', function () {
      try {
        this.bindings = require('../../../bindings/build/Release/kawatorrent.node')
      } catch (e) {
        should.fail('Could not import Libtorrent bindings: ' + e.stack)
      }
    })

    it('should be formatted properly', function () {
      this.bindings.should.be.an('object')
      this.bindings.should.include.keys('torrent')
      this.bindings.torrent.should.be.a('object')
      this.bindings.torrent.should.include.keys(['Client', 'version'])
      this.bindings.torrent.version.should.be.a('string')
      this.bindings.torrent.Client.should.be.a('function')
    })
  })
}
