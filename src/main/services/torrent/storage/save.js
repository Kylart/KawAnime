import { localFiles } from '../../../externals'
import { Logger } from '../../../utils'
import { FILENAME } from './utils'

const logger = new Logger('Torrents:save')

export default function (client) {
  if (!client) return

  const { torrents } = client

  if (!torrents.length) return

  logger.info('Some torrents are still loading, saving for next time...')

  localFiles.writeFile(
    torrents.map(({ path, magnetURI }) => ({
      path,
      magnet: magnetURI
    })),
    FILENAME
  )
}
