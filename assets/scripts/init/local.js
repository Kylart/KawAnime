/**
 * Created by Kylart on 12/04/2017.
 */

const malScraper = require('mal-scraper')
const fs = require('fs')
const {userInfo} = require('os')
const {join, extname} = require('path')
const qs = require('querystring')

const extensions = ['.mkv', '.mp4']

const getName = (rawName) => {
  return rawName.split(' ').slice(1, -3).join(' ')
}

const getEp = (rawName) => {
  return parseInt(rawName.split(' ').splice(-2)[0])
}

const minifyName = (name) => {
  return name.split(' ').join('').toLowerCase()
}

const getUniques = (files) => {
  let result = []

  files.forEach((file) => {
    if (!result.includes(file.split(' ').slice(1, -3).join(' '))) result.push(file.split(' ').slice(1, -3).join(' '))
  })

  return result
}

const sendFiles = (json, files, res) => {
  let result = []

  console.log('[Local] Sending files.')

  files.forEach((file) => {
    let tmp = JSON.parse(JSON.stringify(json[minifyName(getName(file))]))
    tmp.ep = getEp(file)
    tmp.path = file
    result.push(tmp)
  })

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(result))
  res.end()
}

exports.searchLocalFiles = (url, res) => {
  const json = require(join(userInfo().homedir, '.KawAnime', 'locals.json'))

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
        console.log(`[Local] Looking for ${elem} on MAL.`)
        malScraper.getInfoFromName(elem).then((anime) => {
          console.log('[Local] Found!')

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
          if (counter === uniqueNames.length) {
            // Saving new data
            fs.writeFileSync(join(userInfo().homedir, '.KawAnime', 'locals.json'), JSON.stringify(json), 'utf-8')
            console.log('[Local] Successfully saved data.')

            sendFiles(json, files, res)
          }
        }).catch((err) => {
          console.log('[Local] ' + err)
        })
      } else {
        ++counter
        if (counter === uniqueNames.length) sendFiles(json, files, res)
      }
    })
  }
}

exports.resetLocal = (url, res) => {
  /**
   * Here we just erase stored data about files in directory.
   */
  const json = require(join(userInfo().homedir, '.KawAnime', 'locals.json'))

  const query = qs.parse(url.query.replace('?', ''))
  const dir = query.dir

  console.log('[Local] Received a request to reset local data for files in ' + dir)

  const files = fs.readdirSync(dir).filter((file) => { return extensions.includes(extname(file)) })

  files.forEach((file) => {
    delete json[minifyName(getName(file))]
  })

  this.searchLocalFiles(url, res)
}
