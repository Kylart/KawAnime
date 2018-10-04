const fs = require('fs')
const crypto = require('crypto')
const { join, extname } = require('path')

const { parseAnime: parse } = require('zettai')

const { Logger, dir: DIR, readJson } = require('../utils')
const logger = new Logger('Local')

const storagePath = join(DIR, 'locals.json')
const extensions = ['.mkv', '.mp4']

const hashName = (name) => {
  return crypto.createHash('md5').update(name).digest('hex')
}

const saveStorage = (json) => {
  fs.writeFileSync(storagePath, JSON.stringify(json), 'utf-8')
}

const getFiles = ({ query }, res) => {
  const { dir } = query

  const files = fs.readdirSync(dir).filter((file) => extensions.includes(extname(file.toLowerCase())))

  const result = files.map((elem) => {
    return Object.assign({
      path: join(dir, elem)
    }, parse(elem))
  })

  logger.info('Sending files.')

  res.json(result)
}

const getInfo = ({ query }, res) => {
  const { name } = query
  const key = hashName(name)

  const storage = readJson(storagePath)

  const info = storage[key]

  res.status(info ? 200 : 204).json(info || '')
}

const saveInfo = (req, res) => {
  if (req.method !== 'POST') res.status(204).send()

  let data = ''
  req.on('data', (chunk) => (data += chunk))

  req.on('end', () => {
    const storage = readJson(storagePath)
    const { title, info } = JSON.parse(data)

    const key = hashName(title)
    storage[key] = info

    saveStorage(storage)
    logger.info(`Saved info for ${title}.`)

    res.send()
  })
}

const resetInfo = ({ query }, res) => {
  const { name } = query
  const key = hashName(name)

  const storage = readJson(storagePath)

  storage[key] = undefined

  saveStorage(storage)

  logger.info(`Erased info for ${name}.`)

  res.send()
}

module.exports = {
  getFiles,
  saveInfo,
  getInfo,
  resetInfo
}
