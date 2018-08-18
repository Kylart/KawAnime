#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const { join } = require('path')
const args = require('args')
const { port } = require('./config')

function init () {
  args
    .option('port', 'The port on which the app will be running', port)
    .option('server', 'If set to true, KawAnime will start in server-only mode', false)
    .option('verbose', 'Whether or not you want to see logs', false)

  const flags = args.parse(process.argv)

  process.env.PORT = flags.port
  process.env.KAWANIME_SERVER = flags.server
  process.env.VERBOSE = flags.verbose

  if (!flags.server) {
    const electronProcess = require(join(__dirname, 'electron', 'runner.js'))(flags)
    console.log(`> App started with pid ${electronProcess.pid}.`)
  } else {
    require(__dirname)
  }
}

init()
