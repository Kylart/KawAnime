import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

import { localFiles } from '../../../externals'
import { Logger, dir } from '../../../utils'
import { FILENAME } from './utils'

const logger = new Logger('Torrents:load')
const path = join(dir, FILENAME)

export default function (init) {
  if (!existsSync(path)) return

  logger.info('User left torrents in clients. Restoring.')

  const client = init()

  const torrents = localFiles.getFile(FILENAME)

  for (const { magnet, path } of torrents) {
    client.addTorrent(path, magnet)
  }

  unlinkSync(path)

  logger.info('Retrieval over.')
}
