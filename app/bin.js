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
    require(__dirname)
  }
}

function init () {
  args
    .option('port', 'The port on which the app will be running', port)
    .option('server', 'If set to true, KawAnime will start in server-only mode', false)
    .option('verbose', 'Whether or not you want to see logs', false)
    .command('start', 'Start the app', start)

  args.parse(process.argv)
}

init()
