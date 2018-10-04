const { homedir } = require('os')
const { join } = require('path')

const BASE_PATH = homedir()

const dir = process.env.NODE_ENV !== 'KawAnime-test'
  ? join(BASE_PATH, '.KawAnime')
  : join(BASE_PATH, '.KawAnime-test')

module.exports = dir
