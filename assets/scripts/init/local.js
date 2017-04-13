/**
 * Created by Kylart on 12/04/2017.
 */

const malScraper = require('mal-scraper')
const fs = require('fs')
const {userInfo} = require('os')
const {join, extname} = require('path')
const qs = require('querystring')

const animeFile = JSON.parse(fs.readFileSync(join(userInfo().homedir, '.KawAnime', 'locals.json')))

const extensions = ['.mkv', '.mp4']

const sortFiles = (array, descending) => {
  if (descending === true)
    array.sort((a, b) => a.title === b.title ?
        b.ep.toString().localeCompare(a.ep) :
        a.title.toString().localeCompare(b.title))
  else
    array.sort((a, b) => a.title === b.title ?
        -b.ep.toString().localeCompare(a.ep) :
        a.title.toString().localeCompare(b.title))
}

const getNameAndEp = (raw) => {
  return {
    name: raw.raw.split(' ').slice(1, -3).join(' '),
    ep: parseInt(raw.raw.split(' ').splice(-2)[0])
  }
}

const sendRes = (files, res, ascending) => {
  // sortFiles(files, ascending)

  // TODO Sort files before output

  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify(files))
  res.end()
}

exports.getLocalFiles = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))
  const dir = query.dir
  const ascending = query.asc ? query.asc === 'true' : true

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
      const local = animeFile[filteredFiles[i].researchName]
      filteredFiles[i].picture = local.picture
      filteredFiles[i].numberOfEpisode = local.numberOfEpisode
      filteredFiles[i].status = local.status
      filteredFiles[i].year = local.year
      filteredFiles[i].genres = local.genres
      filteredFiles[i].classification = local.classification
      filteredFiles[i].mark = local.mark

      ++counter
      if (counter === filteredFiles.length)
        sendRes(filteredFiles, res, ascending)
    }
    else // Research on MAL
    {
      console.log(`[Local] Looking for ${filteredFiles[i].name} on MAL.`)

      malScraper.getInfoFromName(nameAndEp.name).then((anime) => {
        console.log('[Local] Found!')

        filteredFiles[i].picture = anime.image
        filteredFiles[i].numberOfEpisode = anime.episodes.replace('Unknown', 'NC')
        filteredFiles[i].status = anime.status
        filteredFiles[i].year = anime.aired.split(' ')[2]
        filteredFiles[i].genres = anime.genres
        filteredFiles[i].classification = anime.classification
        filteredFiles[i].mark = anime.statistics.score.value

        // Adding this to locals.json
        // Current file
        const json = require(join(userInfo().homedir, '.KawAnime', 'locals.json'))

        // Adding value
        json[filteredFiles[i].researchName] = filteredFiles[i]

        fs.writeFileSync(join(userInfo().homedir, '.KawAnime', 'locals.json'), JSON.stringify(json))

        ++counter
        if (counter === filteredFiles.length)
          sendRes(filteredFiles, res, ascending)
      }).catch((err) => {
        console.log('[Local] ' + err)
      })
    }
  }
}