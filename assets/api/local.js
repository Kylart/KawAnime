/**
 * Created by Kylart on 12/04/2017.
 */

const malScraper = require('mal-scraper')
const fs = require('fs')
const {userInfo} = require('os')
const {join, extname} = require('path')
const qs = require('querystring')

const extensions = ['.mkv', '.mp4']

const removeUnwanted = (rawName) => {
  return rawName
    .replace(' VOSTFR', '')
}

const getName = (rawName) => {
  try {
    return removeUnwanted(rawName).split(' ').slice(1, -3).join(' ')
  } catch (e) {
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

const sendFiles = (json, files, res) => {
  const result = []

  console.log('[Local]: Sending files.')

  files.forEach((file) => {
    const name = getName(file)
    if (name) {
      const tmp = JSON.parse(JSON.stringify(json[minifyName(name)]))
      tmp.ep = getEp(file)
      tmp.path = file
      result.push(tmp)
    }
  })

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(result))
  res.end()
}

const searchLocalFiles = (url, res) => {
  /* istanbul ignore next */
  const json = process.env.NODE_ENV !== 'KawAnime-test'
    ? require(join(userInfo().homedir, '.KawAnime', 'locals.json'))
    : require(join(userInfo().homedir, '.KawAnime-test', 'locals.json'))

  const query = qs.parse(url.query.replace('?', ''))
  const dir = query.dir

  const files = fs.readdirSync(dir).filter((file) => { return extensions.includes(extname(file)) })
  const uniqueNames = getUniques(files)

  let counter = 0

  if (!files.length) {
    sendFiles(json, [], res)
  } else {
    uniqueNames.forEach((elem) => {
      // Search MAL for each name if not in json
      if (!json[minifyName(elem)]) {
        console.log(`[Local]: Looking for ${elem} on MAL.`)
        malScraper.getInfoFromName(elem).then((anime) => {
          console.log('[Local]: Found!')

          json[minifyName(elem)] = {
            name: elem,
            picture: anime.image,
            numberOfEpisode: anime.episodes.replace('Unknown', 'NC'),
            status: anime.status,
            year: anime.aired.split(' ')[2],
            genres: anime.genres,
            classification: anime.classification,
            mark: anime.statistics.score.value,
            synopsis: anime.synopsis
          }

          ++counter
          /* istanbul ignore next */
          if (counter === uniqueNames.length) {
            /* istanbul ignore next */
            // Saving new data
            process.env.NODE_ENV !== 'KawAnime-test'
              ? fs.writeFileSync(join(userInfo().homedir, '.KawAnime', 'locals.json'), JSON.stringify(json), 'utf-8')
              : fs.writeFileSync(join(userInfo().homedir, '.KawAnime-test', 'locals.json'), JSON.stringify(json), 'utf-8')
            console.log('[Local]: Successfully saved data.')

            sendFiles(json, files, res)
          }
        }).catch(/* istanbul ignore next */(err) => {
          console.log('[Local]: ' + err)
          res.writeHead(204, {})
          res.end()
        })
      } else {
        ++counter
        /* istanbul ignore next */
        if (counter === uniqueNames.length) sendFiles(json, files, res)
      }
    })
  }
}

const resetLocal = (url, res) => {
  /**
   * Here we just erase stored data about files in directory.
   */
  /* istanbul ignore next */
  const json = process.env.NODE_ENV !== 'KawAnime-test'
    ? require(join(userInfo().homedir, '.KawAnime', 'locals.json'))
    : require(join(userInfo().homedir, '.KawAnime-test', 'locals.json'))

  const query = qs.parse(url.query.replace('?', ''))
  const dir = query.dir

  console.log('[Local]: Received a request to reset local data for files in ' + dir)

  const files = fs.readdirSync(dir).filter((file) => { return extensions.includes(extname(file)) })

  files.forEach((file) => {
    delete json[minifyName(getName(file))]
  })

  searchLocalFiles(url, res)
}

module.exports = {
  searchLocalFiles,
  resetLocal
}
