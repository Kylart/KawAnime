/**
 * Created by Kylart on 12/04/2017.
 */

const malScraper = require('mal-scraper')
const fs = require('fs')
const {userInfo} = require('os')
const {join, extname} = require('path')
const qs = require('querystring')

const animeFile = require(join(userInfo().homedir, '.KawAnime', 'anime.json'))

const extensions = ['.mkv', '.mp4']

const getNameAndEp = (raw) => {
  return {
    name: raw.split(' ').slice(1, -3),
    ep: parseInt(raw.split(' ').splice(-2)[0])
  }
}

const sendRes = (files, res) => {
  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify(files))
  res.end()
}

exports.getLocalFiles = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))
  const dir = query.parse(dir)

  let counter = 0

  // Getting files in dir
  const files = fs.readdirSync(dir)

  let filteredFiles = []

  files.forEach((file) => {
    extensions.forEach((extensions) => {
      if (extname(file) === extensions)
        filteredFiles.push({raw: file})
    })
  })

  for (let i = 0; i < filteredFiles.length; ++i)
  {
    const nameAndEp = getNameAndEp(filteredFiles[i])

    filteredFiles[i].name = nameAndEp.name
    filteredFiles[i].ep = nameAndEp.ep
    filteredFiles[i].researchName = nameAndEp.name.split(' ').join('').toLocaleLowerCase()

    // Doing research on local file.
    if (animeFile[filteredFiles[i].researchName])
    {
      console.log('[Local] Info found in local anime.json')

      const local = animeFile[filteredFiles[i].researchName]
      filteredFiles[i].picture = local.picture
      filteredFiles[i].numberOfEpisodes = local.numberOfEpisodes
      filteredFiles[i].status = local.status
      filteredFiles[i].year = local.year
      filteredFiles[i].genres = local.genres
      filteredFiles[i].classification = local.classification
      filteredFiles[i].mark = local.mark

      ++counter
      if (counter === filteredFiles.length)
        sendRes(filteredFiles, res)
    }
    else // Research on MAL
    {
      console.log(`[Local] Looking ${filteredFiles[i].name} on MAL.`)

      console.log('Oups, mal-scraper needs some improvements before...')

      sendRes({}, res)
    }
  }
}