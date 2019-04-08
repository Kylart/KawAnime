import { createHash } from 'crypto'
import { localFiles } from '../../externals'

const FILE_NAME = 'locals.json'

export function hashName (name) {
  return createHash('md5').update(name).digest('hex')
}

export function getCurrentFile () {
  return localFiles.getFile(FILE_NAME)
}
