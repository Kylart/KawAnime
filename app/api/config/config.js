const { join } = require('path')
const { writeFileSync } = require('fs')

const { dir, Logger, readJson } = require('../utils')
const logger = new Logger('Config')

const get = (req, res) => {
  const configPath = join(dir, 'config.json')
  const configFile = readJson(configPath)
  res.type('application/json')
  res.send(configFile)
}

const save = (req, res) => [
  req.on('data', (chunk) => {
    const data = JSON.parse(chunk)
    writeFileSync(join(dir, 'config.json'), JSON.stringify(data))
    logger.info('Successfully saved config!')
    res.status(200).send()
  })
]

module.exports = {
  save,
  get
}
