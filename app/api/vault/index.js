const { join } = require('path')
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs')
const randomString = require('randomstring')

const buttercup = require('buttercup')
const { Archive, Credentials, Datasources } = buttercup
const { FileDatasource } = Datasources

const { Logger, dir } = require('../utils')
const logger = new Logger('Vault')

const DIR = join(dir, 'vault')
const keyPath = join(DIR, 'p')

const setupCreds = (service, creds) => {
  return new Promise((resolve, reject) => {
    /* istanbul ignore next */
    if (!existsSync(DIR)) {
      // Creating vault directory
      mkdirSync(DIR)
      logger.info('No vault detected. Creating...')

      // Setting up master key
      // This should be a separate method linked to a route
      // so that the user can set its own master password
      // if they want to.
      writeFileSync(keyPath, randomString.generate(40), 'utf-8')
    }

    const fileDatasource = new FileDatasource(join(DIR, service + '.bcup'))
    const key = readFileSync(keyPath, 'utf-8')

    const archive = Archive.createWithDefaults()
    archive
      .createGroup('Websites')
      .createEntry(service)
      .setProperty('username', creds.username)
      .setProperty('password', creds.password)

    const credentials = Credentials.fromPassword(key)

    fileDatasource.save(archive.getHistory(), credentials)
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
    if (!existsSync(DIR)) {
      logger.info('No vault instanciated for current user.')
      return resolve({})
    }

    const fileDatasource = new FileDatasource(join(DIR, service + '.bcup'))
    const key = readFileSync(keyPath, 'utf-8')

    const credentials = Credentials.fromPassword(key)

    fileDatasource
      .load(credentials)
      .then(Archive.createFromHistory)
      .then((archive) => {
        const group = archive.findGroupsByTitle('Websites')[0]
        const entries = group.getEntries()
        let hasResolved = false

        // Finding the right entry.
        // There should be only one entry anyway but you never know
        entries.forEach((entry) => {
          const title = entry.getProperty('title')

          if (title === service && !hasResolved) {
            hasResolved = true

            resolve({
              username: entry.getProperty('username'),
              password: entry.getProperty('password')
            })
          }
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
