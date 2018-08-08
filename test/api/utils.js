const { homedir } = require('os')
const { join } = require('path')
const express = require('express')
const api = require('../../app/api')

const DIR = join(homedir(), '.KawAnime-test')

module.exports = {
  DIR,

  makeApp () {
    const app = express()

    api(app)

    return app
  },

  kawAnimeFilesPath: {
    local: join(DIR, 'locals.json'),
    history: join(DIR, 'history.json'),
    watchList: join(DIR, 'lists.json'),
    config: join(DIR, 'config.json'),
    token: join(DIR, '_token'),
    vault: {
      base: join(DIR, 'vault'),
      key: join(DIR, 'vault', 'p'),
      mal: join(DIR, 'vault', 'mal.bcup')
    }
  }
}
