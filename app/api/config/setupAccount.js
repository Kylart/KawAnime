const { join } = require('path')
const { writeFileSync } = require('fs')

const vault = require('../vault')
const { dir } = require('../utils')

const setupAccount = (req, res) => {
  req.on('data', (chunk) => {
    const { service, credentials } = JSON.parse(chunk)

    // Writting the username in the config file so no one forgets
    const p = join(dir, 'config.json')
    const conf = require(p)
    conf.config.malUsername = credentials.username

    writeFileSync(p, JSON.stringify(conf), 'utf-8')

    vault.setupCreds(service, credentials)
      .then(() => res.send())
      .catch(/* istanbul ignore next */ () => res.status(204).send())
  })
}

module.exports = {
  setupAccount
}
