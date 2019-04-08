import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { each } from 'lodash'

import { dir, Logger } from '../server/utils'
import { localFiles } from '../server/externals'
import * as templates from './templates'

const logger = new Logger('Init')

function checkDir () {
  if (!existsSync(dir)) {
    logger.info('Creating main directory.')

    mkdirSync(dir)
  }
}

function checkFiles () {
  const files = [
    'history',
    'locals',
    'lists'
  ]

  files.forEach((file) => {
    const { filename, template } = templates[file]
    const _path = join(dir, filename)

    if (!existsSync(_path)) {
      logger.info(`Creating ${file} file.`)

      writeFileSync(_path, JSON.stringify(template), 'utf-8')
    }
  })
}

function checkConfig () {
  const { filename, template } = templates.config
  const _path = join(dir, filename)

  if (!existsSync(_path)) {
    logger.info('Creating configuration file.')

    writeFileSync(_path, JSON.stringify(template), 'utf-8')

    return
  }

  // Checking if no key is missing. Careful, works only up to 2 levels inside config
  let changed = false
  const currentConf = localFiles.getFile(filename)

  each(template.config, (elem, key) => {
    /* istanbul ignore next */
    if (typeof currentConf.config[key] === 'undefined') {
      currentConf.config[key] = elem
      changed = true
    }

    if (typeof elem === 'object') {
      each(elem, (value, subKey) => {
        // We need to check if the subKey is in elem
        if (!(subKey in currentConf.config[key])) {
          currentConf.config[key][subKey] = value
          changed = true
        }
      })
    }
  })

  changed &&
  writeFileSync(_path, JSON.stringify(currentConf), 'utf-8') &&
  logger.info('Modified confuration file.')
}

function checkToken () {
  const { filename, template } = templates.token
  const _path = join(dir, filename)

  if (!existsSync(_path)) {
    logger.info('Creating user token.')

    writeFileSync(_path, template, 'utf-8')
  }
}

checkDir()
checkConfig()
checkFiles()
checkToken()
