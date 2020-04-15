const chai = require('chai')

const should = chai.should()
const expect = chai.expect

module.exports = function () {
  describe('Anitomy bindings', function () {
    this.bindings = null

    it('should successfullly import the bindings', function () {
      try {
        this.bindings = require('../../../bindings/build/Release/kawaparser.node')
      } catch (e) {
        should.fail('Could not import Anitomy bindings: ' + e.stack)
      }
    })

    it('should be formatted properly', function () {
      this.bindings.should.be.an('object')
      this.bindings.should.include.keys('parseName')
      this.bindings.parseName.should.be.a('function')
    })

    it('should be able to parse some filenames', function () {
      const data = require('./data.json')
      const parse = this.bindings.parseName

      data.forEach(({ filename, result }) => {
        expect(parse(filename)).to.eql(result)
      })
    })
  })
}
