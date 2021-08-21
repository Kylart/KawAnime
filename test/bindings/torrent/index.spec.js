const chai = require('chai')

const should = chai.should()

const MAGNET_LINK = 'magnet:?xt=urn:btih:50af27af300b44aec651add3eeb7135fd0c15bfa&dn=%5BHorribleSubs%5D%20Hoshiai%20no%20Sora%20-%2005%20%5B720p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce'
const DIR = './downloads'

module.exports = function () {
  describe('Libtorrent bindings', function () {
    this.bindings = null
    this.client = null

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

    it('should create a valid client', function () {
      this.client = new this.bindings.torrent.Client()

      this.client.addTorrent.should.be.a('function')
      this.client.addTorrent.should.be.a('function')
      this.client.getTorrents.should.be.a('function')
      this.client.getTorrent.should.be.a('function')
      this.client.removeTorrent.should.be.a('function')
      this.client.getClientInfo.should.be.a('function')
      this.client.hasTorrents.should.be.a('function')
      this.client.isDestroyed.should.be.a('function')
    })

    it('should add a torrent', function () {
      const addedTorrent = this.client.addTorrent(DIR, MAGNET_LINK)

      addedTorrent.should.not.equal(null)

      this.client.getTorrents().length.should.equal(1)

      const torrent = this.client.getTorrents()[0]

      torrent.info.should.be.a('function')
      torrent.setLimit.should.be.a('function')
      torrent.pause.should.be.a('function')
      torrent.resume.should.be.a('function')

      const info = torrent.info()

      info.should.not.equal(null)

      info.should.include.keys([
        'id',
        'downloadLimit',
        'uploadLimit',
        'name',
        'progress',
        'done',
        'totalSize',
        'magnetURI',
        'downloaded',
        'state',
        'uploadRate',
        'downloadRate',
        'path',
        'numPeers',
        'isAutoManaged',
        'isPaused',
        'savePath',
        'timeRemaining',
        'files'
      ])
    })
  })
}
