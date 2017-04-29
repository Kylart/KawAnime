/**
 * Created by Kylart on 12/04/2017.
 */

const malScraper = require('mal-scraper')
const fs = require('fs')
const {userInfo} = require('os')
const {join, extname} = require('path')
const qs = require('querystring')

const extensions = ['.mkv', '.mp4']

const getNameAndEp = (raw) => {
  return {
    name: raw.raw.split(' ').slice(1, -3).join(' '),
    ep: parseInt(raw.raw.replace(' VOSTFR', '').split(' ').splice(-2)[0])
  }
}

const sendRes = (files, res, paths) => {
  for (let i = 0; i < files.length; ++i)
    files[i].path = paths[i]

  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify(files))
  res.end()
}

exports.getLocalFiles = (url, res) => {
  const animeFile = JSON.parse(fs.readFileSync(join(userInfo().homedir, '.KawAnime', 'locals.json')))

  const query = qs.parse(url.query.replace('?', ''))
  const dir = query.dir

  let counter = 0

  // Getting files in dir
  const files = fs.readdirSync(dir)

  let filteredFiles = []
  let paths = []

  files.forEach((file) => {
    extensions.forEach((extensions) => {
      if (extname(file) === extensions)
        filteredFiles.push({raw: file})
    })
  })

  // TODO
  // If a name does not exist in locals.json and there are several episodes of it
  // It will send as many request as there are of episode. Not good
  for (let i = 0; i < filteredFiles.length; ++i)
  {
    const nameAndEp = getNameAndEp(filteredFiles[i])

    filteredFiles[i].name = nameAndEp.name
    filteredFiles[i].ep = nameAndEp.ep
    filteredFiles[i].researchName = nameAndEp.name.split(' ').join('').toLocaleLowerCase()

    // Doing research on local file.
    if (animeFile[filteredFiles[i].researchName])
    {
      paths[i] = filteredFiles[i].raw

      const local = animeFile[filteredFiles[i].researchName]
      filteredFiles[i].raw = undefined
      filteredFiles[i].picture = local.picture
      filteredFiles[i].numberOfEpisode = local.numberOfEpisode
      filteredFiles[i].status = local.status
      filteredFiles[i].year = local.year
      filteredFiles[i].genres = local.genres
      filteredFiles[i].classification = local.classification
      filteredFiles[i].mark = local.mark
      filteredFiles[i].synopsis = local.synopsis

      ++counter
      if (counter === filteredFiles.length)
        sendRes(filteredFiles, res, paths)
    }
    else // Research on MAL
    {
      console.log(`[Local] Looking for ${filteredFiles[i].name} on MAL.`)

      malScraper.getInfoFromName(nameAndEp.name).then((anime) => {
        console.log('[Local] Found!')

        // Pathname must NOT be saved!
        paths[i] = filteredFiles[i].raw

        filteredFiles[i].raw = undefined
        filteredFiles[i].picture = anime.image
        filteredFiles[i].numberOfEpisode = anime.episodes.replace('Unknown', 'NC')
        filteredFiles[i].status = anime.status
        filteredFiles[i].year = anime.aired.split(' ')[2]
        filteredFiles[i].genres = anime.genres
        filteredFiles[i].classification = anime.classification
        filteredFiles[i].mark = anime.statistics.score.value
        filteredFiles[i].synopsis = anime.synopsis

        // Adding this to locals.json
        // Current file
        const json = require(join(userInfo().homedir, '.KawAnime', 'locals.json'))

        // Adding value
        json[filteredFiles[i].researchName] = filteredFiles[i]

        fs.writeFile(join(userInfo().homedir, '.KawAnime', 'locals.json'), JSON.stringify(json), (err) => {
          if (err) throw err

          ++counter
          if (counter === filteredFiles.length)
            sendRes(filteredFiles, res, paths)
        })
      }).catch((err) => {
        console.log('[Local] ' + err)
      })
    }
  }
}

exports.resetLocal = (res) => {
  const listPath = join(userInfo().homedir, '.KawAnime', 'locals.json')

  const basicLists = {
    watchList: [],
    seen: [],
    watching: []
  }

  console.log('[Local]: Received a request for resetting old local data.')

  console.log('[Local]: Re-creating basic file.')
  fs.writeFileSync(listPath, JSON.stringify(basicLists), 'utf-8')

  res.writeHead(200, {})
  res.end()
}