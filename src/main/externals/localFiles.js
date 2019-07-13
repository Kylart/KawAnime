import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { dir } from '../utils'

function getPath (...paths) {
  return join(
    dir,
    ...paths
  )
}

function getFile (...paths) {
  const path = getPath(...paths)

  return JSON.parse(readFileSync(path, 'utf-8'))
}

function writeFile (data, ...paths) {
  const path = getPath(...paths)

  writeFileSync(path, JSON.stringify(data), 'utf-8')
}

export default {
  getPath,
  getFile,
  writeFile
}
