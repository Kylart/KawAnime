const { join } = require('path')
const _ = require('lodash')
const axios = require('axios')
const { dir } = require('../utils')

const _VERSION_ = require(join(__dirname, '..', '..', '..', 'package.json')).version
const configPath = join(dir, 'config.json')
const config = require(configPath)

const mustShow = config.config.version !== _VERSION_

const get = async (req, res) => {
  try {
    const { data, status } = await axios.get('https://api.github.com/repos/Kylart/KawAnime/releases')

    const toSend = {
      logs: _.find(data, (e) => e.name === `v${_VERSION_}`).body,
      mustShow
    }

    res.status(status === 200 ? 200 : 204).send(toSend)
  } catch (e) {
    res.status(204).send()
  }
}

module.exports = get
