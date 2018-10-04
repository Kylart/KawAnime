const { join } = require('path')
const { writeFileSync } = require('fs')
const { dir } = require('../utils')

const _VERSION_ = require(join(__dirname, '..', '..', '..', 'package.json')).version
const configPath = join(dir, 'config.json')
const config = require(configPath)

const updateReleaseVersion = (req, res) => {
  config.config.version = _VERSION_
  writeFileSync(configPath, JSON.stringify(config), 'utf-8')

  res.status(200).send()
}

module.exports = updateReleaseVersion
