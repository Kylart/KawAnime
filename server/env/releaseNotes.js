const {join} = require('path')
const _ = require('lodash')
const axios = require('axios')
const _VERSION_ = require(join(__dirname, '..', '..', 'package.json')).version

const get = async (req, res) => {
  try {
    const {data, status} = await axios.get('https://api.github.com/repos/Kylart/KawAnime/releases')

    status === 200
      ? res.status(200).send(_.find(data, (e) => e.name === `v${_VERSION_}`).body)
      : res.status(204).send()
  } catch (e) {
    res.status(204).send()
  }
}

module.exports = get
