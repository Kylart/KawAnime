import { readdirSync } from 'fs'
import { extname, join } from 'path'

import { eventsList } from '../../../../vendor'
import { parseName } from '../../externals'
import { Logger } from '../../utils'
import { hashName, getCurrentFile } from './utils'

const logger = new Logger('Local Files (Get)')

const events = eventsList.local.get
const extensions = ['.mkv', '.mp4']

function sendLocalFiles (dir) {
  logger.info('Sending files.')

  return readdirSync(dir)
    .filter(
      (file) => extensions.includes(extname(file.toLowerCase()))
    )
    .map((elem) => Object.assign({
      path: join(dir, elem)
    }, parseName(elem)))
}

function sendLocalInfo (name) {
  const key = hashName(name)
  const storage = getCurrentFile()

  return storage[key] || null
}

async function retrieve (event, { name, dir, isSync = false }) {
  try {
    const result = name
      ? sendLocalInfo(name)
      : sendLocalFiles(dir)

    isSync
      ? (event.returnValue = { name, dir, result })
      : event.sender.send(events.success, { name, dir, result })
  } catch (e) /* istanbul ignore next */ {
    logger.error('An error occurred.', e.stack)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: retrieve
}
