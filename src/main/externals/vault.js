import { existsSync, mkdirSync, readFileSync } from 'fs'
import { Archive, Credentials, Datasources } from 'buttercup'

import localFiles from './localFiles'
import { Logger } from '../utils'

const DIR_NAME = 'KawVault'
const KEY_NAME = 'Schwi'
const BCUP_FILE_NAME = 'Hestia.bcup'
const GROUP_NAME = 'Haruka'

const DIR = localFiles.getPath(DIR_NAME)
const keyPath = localFiles.getPath(DIR_NAME, KEY_NAME)

const { FileDatasource } = Datasources
const logger = new Logger('Vault')

function generateToken () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function checkDir () {
  if (!existsSync(DIR)) {
    // Creating vault directory
    mkdirSync(DIR)

    // Setting up master key
    // This should be a separate method linked to a route
    // so that the user can set its own master password
    // if they want to.
    localFiles.writeFile(generateToken(), DIR_NAME, KEY_NAME)
  }
}

async function getArchive (fileDatasource) {
  const key = readFileSync(keyPath, 'utf-8')

  const credentials = Credentials.fromPassword(key)

  const dataSource = await fileDatasource.load(credentials)
  const archive = await Archive.createFromHistory(dataSource)

  return archive
}

async function getGroup (fileDatasource) {
  const archive = await getArchive(fileDatasource)

  return archive.getGroups().find((g) => g.getTitle() === GROUP_NAME)
}

export async function setupCreds (service, creds) {
  checkDir()

  const _path = localFiles.getPath(DIR_NAME, BCUP_FILE_NAME)
  const fileDatasource = new FileDatasource(_path)
  const hasPath = existsSync(_path)
  const key = readFileSync(keyPath, 'utf-8')
  const credentials = Credentials.fromPassword(key)

  if (hasPath) {
    const archive = await getArchive(fileDatasource)
    const group = archive.getGroups().find((g) => g.getTitle() === GROUP_NAME)
    const entry = group.getEntries().find((_entry) => _entry.getProperty('title') === service)
    const elem = entry || group.createEntry(service)

    Object.keys(creds).forEach((credName) => {
      elem.setProperty(credName, `${creds[credName]}`)
    })

    await fileDatasource.save(archive.getHistory(), credentials)
  } else {
    const archive = Archive.createWithDefaults()

    const entry = archive
      .createGroup(GROUP_NAME)
      .createEntry(service)

    Object.keys(creds).forEach((credName) => {
      entry.setProperty(credName, `${creds[credName]}`)
    })

    await fileDatasource.save(archive.getHistory(), credentials)
  }
}

/**
 * Allows the retrieval of properties in the vault.
 *
 * @param {string} service Service in which to retrieve the credentials property from.
 * @param {string[]} properties Properties to retrieve from the vault.
 */
export async function getCreds (service, properties = ['username', 'password']) {
  const _path = localFiles.getPath(DIR_NAME, BCUP_FILE_NAME)

  if (!existsSync(_path)) {
    return 0
  }

  const fileDatasource = new FileDatasource(_path)
  const group = await getGroup(fileDatasource)
  const entries = group.getEntries()

  // Finding the right entry.
  const entry = entries.find((entry) => entry.getProperty('title') === service)

  if (!entry) throw new Error('No service credentials for ' + service)

  logger.info(`Retrieved credentials for ${service}.`)

  return properties.reduce((acc, property) => {
    acc[property] = entry.getProperty(property)

    return acc
  }, {})
}
