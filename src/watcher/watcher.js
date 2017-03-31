/**
 * Created by Kylart on 30/03/2017.
 */

const self = this

const fs = require('fs')
const os = require('os')
const path = require('path')

const ROOT_DIR = os.userInfo().homedir
const DIR = path.join(ROOT_DIR, '.KawAnime')

const watchConf = (callback) => {
  fs.watchFile(path.join(DIR, 'config.json'), (event) => {
    console.log(event)
  })
}

module.exports = {
  watchConf
}