const malScraper = require('mal-scraper')
const fs = require('fs')
const {join, extname} = require('path')
const {removeUnwanted, Logger, dir} = require('../utils')
const logger = new Logger('Local')

const extensions = ['.mkv', '.mp4']

const getName = (rawName) => {
  try {
    return removeUnwanted(rawName).split(' ').slice(1, -3).join(' ')
  } catch (e) {
    /* istanbul ignore next */
    return null
  }
}

const getEp = (rawName) => {
  return parseInt(removeUnwanted(rawName).split(' ').splice(-2)[0])
}

const minifyName = (name) => {
  return name.split(' ').join('').toLowerCase()
}

const getUniques = (files) => {
  const result = []

  files.forEach((file) => {
    const toAdd = getName(file) || null

    if (toAdd && !result.includes(toAdd)) {
      result.push(toAdd)
    }
  })

  return result
}

const sendFiles = (json, dir, files, res) => {
  const result = []

  logger.info('Sending files.')

  files.forEach((file) => {
    const name = getName(file)
    if (name) {
      const tmp = JSON.parse(JSON.stringify(json[minifyName(name)]))
      tmp.ep = getEp(file)
      tmp.path = join(dir, file)
      result.push(tmp)
    }
  })

  res.type('application/json')
  res.status(200).send(JSON.stringify(result))
}

const searchLocalFiles = ({query}, res) => {
  const json = require(join(dir, 'locals.json'))

  const DIR = query.dir

  const files = fs.readdirSync(DIR).filter((file) => extensions.includes(extname(file.toLowerCase())))
  const uniqueNames = getUniques(files)

  let counter = 0

  if (!files.length) {
    sendFiles(json, DIR, [], res)
  } else {
    uniqueNames.forEach((elem) => {
      // Search MAL for each name if not in json
      if (!json[minifyName(elem)]) {
        logger.info(`Looking for ${elem} on MAL.`)
        malScraper.getInfoFromName(elem).then((anime) => {
          logger.info('Found!')

          json[minifyName(elem)] = {
            name: elem,
            picture: anime.picture,
            numberOfEpisode: anime.episodes.replace('Unknown', 'NC'),
            status: anime.status,
            year: anime.aired.split(' ')[2],
            genres: anime.genres,
            classification: anime.rating,
            mark: anime.score,
            synopsis: anime.synopsis
          }

          ++counter
          /* istanbul ignore next */
          if (counter === uniqueNames.length) {
            // Saving new data
            fs.writeFileSync(join(dir, 'locals.json'), JSON.stringify(json), 'utf-8')

            logger.info('Successfully saved data.')

            sendFiles(json, DIR, files, res)
          }
        }).catch(/* istanbul ignore next */(err) => {
          logger.error('An error occurred.', err)
          res.status(204).send()
        })
      } else {
        ++counter
        /* istanbul ignore next */
        if (counter === uniqueNames.length) sendFiles(json, DIR, files, res)
      }
    })
  }
}

/* istanbul ignore next */
const resetLocal = (req, res) => {
  // Here we just erase stored data about files in directory.
  const json = require(join(dir, 'locals.json'))

  const path = req.query.dir

  logger.info('Received a request to reset local data for files in ' + path)

  const files = fs.readdirSync(path).filter((file) => extensions.includes(extname(file.toLowerCase())))

  files.forEach((file) => {
    delete json[minifyName(getName(file))]
  })

  searchLocalFiles(req, res)
}

module.exports = {
  searchLocalFiles,
  resetLocal
}
