/**
 * Created by Kylart on 18/03/2017.
 */

const self = this

const fs = require('fs')
const os = require('os')
const path = require('path')
const player = require('play-sound')(opts = {})
const configFile = require(path.join(os.userInfo().homedir, '.KawAnime', 'config.json'))

exports.playSound = (name) => {
  if (name === 'None') return

  player.play(path.join(__dirname, '..', '..', 'resources', `${name}.m4a`), (err) => {
    if (err) throw err
  })
}

exports.loadConf = (object) => {
  object.config = configFile.config
  console.log(configFile.config)
}

exports.saveConfig = (object) => {
  const newData = object.config

  const toSave = {
    config: newData
  }

  fs.writeFileSync(path.join(os.userInfo().homedir, '.KawAnime', 'config.json'), JSON.stringify(toSave))

  object.$refs.snackbar.open()
}