import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

import { localFiles } from '../../../externals'
import { Logger, dir } from '../../../utils'
import { FILENAME } from './utils'

const logger = new Logger('Torrents:load')
const path = join(dir, FILENAME)

export default function (client) {
  if (!existsSync(path)) return

  logger.info('User left torrents in clients. Restoring.')

  const torrents = localFiles.getFile(FILENAME)

  for (const { magnet, path } of torrents) {
    console.log(magnet, path)
    client.add(magnet, { path })
  }

  unlinkSync(path)

  logger.info('Retrieval over.')
}
