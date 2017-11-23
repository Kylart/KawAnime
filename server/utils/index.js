/**
 * Created by Kylart on 04/08/2017.
 */

const removeUnwanted = require('./removeUnwanted')
const {Logger} = require('./logger.js')
const dir = require('./dir.js')

module.exports = {
  removeUnwanted,
  dir,
  Logger
}
