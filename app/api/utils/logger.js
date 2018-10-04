/**
 * Very basic logger as we don't need much more.
 */

const { join } = require('path')
const { appendFileSync } = require('fs')
const chalk = require('chalk')

const dir = require('./dir.js')

const Logger = class {
  constructor (label) {
    this.setLabel(label)
  }

  setLabel (label) {
    this.label = `[${label}]`
  }

  getDate () {
    return `[${(new Date()).toLocaleDateString()}] ${(new Date()).toLocaleTimeString()}`
  }

  shouldLog () {
    return process.env.NODE_ENV === 'development' ||
      process.env.VERBOSE === 'true'
  }

  stringify (obj) {
    return obj
      ? obj.stack
        ? '\n' + obj.stack
        : '\n' + JSON.stringify(obj, null, 2)
      : ''
  }

  toFile (type, msg, obj) {
    if (process.env.NODE_ENV === 'KawAnime-test') return

    const _msg = `${this.getDate()} ${type === 'error' ? 'ERROR' : 'INFO '} > ${this.label} ${msg} ${this.stringify(obj)}\n`

    if (type === 'error') {
      appendFileSync(join(dir, 'error.log'), _msg, 'utf-8')
    }

    appendFileSync(join(dir, 'logs.log'), _msg, 'utf-8')
  }

  /**
   * Log an info from KawAnime's server
   *
   * @param {string} msg Log message
   * @param {object} obj Optional object to log
   */

  info (msg, obj) {
    this.shouldLog() && console.log(
      chalk.cyan(this.getDate()),
      chalk.bold.green('- INFO  >'),
      chalk.bold.green(this.label + ':'),
      msg,
      this.stringify(obj)
    )
    this.toFile('info', msg, obj)
  }

  /**
   * Log an error from KawAnime's server
   *
   * @param {string} msg Log message
   * @param {error} err Optional error to log
   */

  error (msg, err) {
    this.shouldLog() && console.error(
      chalk.magenta(this.getDate()),
      chalk.bold.red('- ERROR >'),
      chalk.bold.red(this.label + ':'),
      msg,
      this.stringify(err)
    )
    this.toFile('error', msg, err)
  }
}

module.exports = {
  Logger
}
