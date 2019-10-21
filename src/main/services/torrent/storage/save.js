import { localFiles } from '../../../externals'
import { Logger } from '../../../utils'
import { FILENAME } from './utils'

const logger = new Logger('Torrents:save')

/**
 * @typedef {object} TorrentEntry
 * @property {number} TorrentEntry.id Id of the torrent when created
 * @property {string} TorrentEntry.magnet Magnet OR torrent file path to create the torrent
 * @property {string} TorrentEntry.path Save path of the torrent
 */

/**
 * Save torrent client state to disk so that it can be resurrected
 * on next session.
 *
 * @export
 * @param {object} client
 * @param {[TorrentEntry]} torrentsMap
 */
export default function (client, torrentsMap) {
  if (!client || !torrentsMap.length) return

  logger.info('Some torrents are still loading, saving for next time...')

  localFiles.writeFile(
    torrentsMap,
    FILENAME
  )
}
