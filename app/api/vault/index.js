const { join } = require('path')
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs')
const randomString = require('randomstring')
const buttercup = require('buttercup')
const { Archive, createCredentials, FileDatasource, EntryFinder } = buttercup

const { Logger, dir } = require('../utils')
const logger = new Logger('Vault')

const DIR = join(dir, 'vault')
const keyPath = join(DIR, 'p')

const setupCreds = (service, credentials) => {
  return new Promise((resolve, reject) => {
    /* istanbul ignore next */
    if (!existsSync(DIR)) {
      // Creating vault directory
      mkdirSync(DIR)
      logger.info('No vault detected. Creating...')

      // Setting up master key
      writeFileSync(keyPath, randomString.generate(40), 'utf-8')
    }

    // Setting up archive for this service
    const archive = new Archive()

    const main = archive.createGroup('main')
    const entry = main.createEntry('account')

    entry
      .setAttribute('username', credentials.username)
      .setAttribute('password', credentials.password)

    const ds = new FileDatasource(join(DIR, service + '.bcup'))
    const key = readFileSync(keyPath, 'utf-8')

    ds.save(archive, createCredentials.fromPassword(key))
      .then((data) => {
        logger.info('Saved new credentials.')
        resolve()
      })
      .catch(/* istanbul ignore next */ (err) => {
        logger.error('Error while saving file:', err)
        reject(err)
      })
  })
}

const getCreds = (service) => {
  return new Promise((resolve, reject) => {
    const ds = new FileDatasource(join(DIR, service + '.bcup'))
    const key = readFileSync(keyPath, 'utf-8')

    ds.load(createCredentials.fromPassword(key))
      .then((archive) => {
        const finder = new EntryFinder([archive])
        const res = finder.search('account')[0].entry
        resolve({
          username: res.getAttribute('username'),
          password: res.getAttribute('password')
        })
      })
      .catch(/* istanbul ignore next */ (err) => {
        logger.error('Error while getting creds:', err)
        reject(err)
      })
  })
}

module.exports = {
  setupCreds,
  getCreds
}
