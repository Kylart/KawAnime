import { readdirSync, statSync } from 'fs'
import { extname, join, basename } from 'path'

import { eventsList } from 'vendor'
import { parseName } from '../../externals'
import { Logger } from '../../utils'
import { hashName, getCurrentFile } from './utils'

const logger = new Logger('Local Files (Get)')

const events = eventsList.local.get
const extensions = ['.mkv', '.mp4']

function getAllFiles (dir) {
  return readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file)
    const isDirectory = statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])
}

function sendLocalFiles (dir, isRecursive) {
  logger.info('Sending files.')

  const files = isRecursive
    ? getAllFiles(dir)
    : readdirSync(dir)

  return files
    .filter(
      (file) => extensions.includes(extname(file.toLowerCase()))
    )
    .map((elem) => {
      const path = isRecursive ? elem : join(dir, elem)
      const parsed = parseName(basename(path))

      return {
        path,
        ep: parsed.episode_number,
        title: parsed.anime_title,
        releaseGroup: parsed.release_group,
        ...parsed
      }
    })
}

function sendLocalInfo (name) {
  const key = hashName(name)
  const storage = getCurrentFile()

  return storage[key] || null
}

async function retrieve (event, { name, dir, isSync = false, isRecursive = false }) {
  try {
    const result = name
      ? sendLocalInfo(name)
      : sendLocalFiles(dir, isRecursive)

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
