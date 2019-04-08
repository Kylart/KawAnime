import { existsSync, mkdirSync, readFileSync } from 'fs'
import { Archive, Credentials, Datasources } from 'buttercup'

import localFiles from './localFiles'

const DIR_NAME = 'KawVault'
const KEY_NAME = 'Schwi'

const DIR = localFiles.getPath(DIR_NAME)
const keyPath = localFiles.getPath(DIR_NAME, KEY_NAME)

const { FileDatasource } = Datasources

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

export async function setupCreds (service, creds) {
  try {
    checkDir()

    const fileDatasource = new FileDatasource(localFiles.getPath(DIR_NAME, service + '.bcup'))
    const key = readFileSync(keyPath, 'utf-8')

    const archive = Archive.createWithDefaults()
    archive
      .createGroup('Websites')
      .createEntry(service)
      .setProperty('username', creds.username)
      .setProperty('password', creds.password)

    const credentials = Credentials.fromPassword(key)

    await fileDatasource.save(archive.getHistory(), credentials)
  } catch (e) {
    throw e
  }
}

export async function getCreds (service) {
  try {
    const servicePath = localFiles.getPath(DIR_NAME, service + '.bcup')

    if (!existsSync(servicePath)) {
      return 0
    }

    const fileDatasource = new FileDatasource(servicePath)
    const key = readFileSync(keyPath, 'utf-8')

    const credentials = Credentials.fromPassword(key)

    const archive = await Archive.createFromHistory(
      await fileDatasource.load(credentials)
    )

    const group = archive.findGroupsByTitle('Websites')[0]
    const entries = group.getEntries()

    // Finding the right entry.
    // There should be only one entry anyway but you never know
    const entry = entries.find((entry) => entry.getProperty('title') === service)

    if (!entry) throw new Error('No service credentials for ' + service)

    return {
      username: entry.getProperty('username'),
      password: entry.getProperty('password')
    }
  } catch (e) {
    throw e
  }
}
