import { existsSync, copyFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import rimraf from 'rimraf'

import { dir as newDir, Logger } from '../server/utils'

const logger = new Logger('Migration')
const BASE_PATH = homedir()
const oldDir = join(BASE_PATH, '.KawAnime')

export default function () {
  if (existsSync(oldDir)) {
    [
      'config.json',
      'lists.json',
      'locals.json',
      'history.json',
      '_token'
    ].forEach((file) => {
      const _path = join(oldDir, file)

      existsSync(_path) && copyFileSync(_path, join(newDir, file))
    })

    rimraf(oldDir, (err) => {
      if (err) throw err

      logger.info('Migration successful.')
    })
  }
}
