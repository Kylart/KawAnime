import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import rimraf from 'rimraf'

import { dir as newDir, Logger, hashName } from '../utils'

const logger = new Logger('Migration')
const BASE_PATH = homedir()
const oldDir = join(BASE_PATH, '.KawAnime')

function migrateLists () {
  const filename = 'lists.json'
  const filepath = join(oldDir, filename)

  if (!existsSync(filepath)) return

  const oldData = JSON.parse(readFileSync(filepath, 'utf-8'))
  const newData = {}

  Object.keys(oldData).forEach((listName) => {
    const list = oldData[listName]

    newData[listName] = []

    list.forEach((name) => {
      newData[listName].push({
        name,
        progress: {
          watching: 1,
          watchList: 0,
          onHold: 4,
          dropped: 3,
          seen: 12
        }[listName],
        score: null,
        list: listName,
        tags: [],
        note: '',
        key: hashName(name)
      })
    })
  })

  writeFileSync(join(newDir, 'localLists.json'), JSON.stringify(newData), 'utf-8')
}

export default function () {
  if (existsSync(oldDir)) {
    [
      'config.json',
      'history.json',
      '_token'
    ].forEach((file) => {
      const _path = join(oldDir, file)

      existsSync(_path) && copyFileSync(_path, join(newDir, file))
    })

    migrateLists()

    rimraf(oldDir, (err) => {
      if (err) throw err

      logger.info('Migration successful.')
    })
  }
}
