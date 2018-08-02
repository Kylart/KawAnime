#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const { join } = require('path')
const args = require('args')
const { port } = require('./config')

function start (name, sub, opts) {
  process.env.PORT = opts.port
  process.env.KAWANIME_SERVER = opts.server
  process.env.VERBOSE = opts.verbose

  if (!opts.server) {
    const electronProcess = require(join(__dirname, 'electron', 'runner.js'))(opts)
    console.log(`> App started with pid ${electronProcess.pid}.`)
  } else {
    if (opts.detached) {
      console.log('\tCannot start detached server. You might never be able to close it.')
      console.log('\tIf you really wish to do so, please contact me on Discord or by mail: kylart.dev@gmail.com\n\n')
    }

    require(__dirname)
  }
}

function init () {
  args
    .option('port', 'The port on which the app will be running', port)
    .option('server', 'If set to true, KawAnime will start in server-only mode', false)
    .option('detached', 'If set to true, the control of your console will be given back to you', false)
    .option('verbose', 'Whether or not you want to see logs', false)
    .command('start', 'Start the app', start)

  args.parse(process.argv)
}

init()
