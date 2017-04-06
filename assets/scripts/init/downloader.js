/**
 * Created by Kylart on 05/04/2017.
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const qs = require('querystring')

const nyaa = require('nyaapi')
const request = require('request')  // This one should be installed with nyaapi and malScraper.
const parseTorrent = require('parse-torrent')

const DIR = path.join(os.userInfo().homedir, '.KawAnime')

// Nyanpasu ~
const player = require('play-sound')(opts = {})

const fansub = 'HorribleSubs'

const deleteOldTorrents = () => {
  console.log('Processing to purge all old torrent files.')

  fs.readdirSync(DIR).forEach((file) => {
    if (path.extname(file) === '.torrent')
    {
      fs.unlink(path.join(DIR, file), () => {
        console.log(`Removed ${file}...`)
      })
    }
  })
}

const openMagnets = (res, items, data) => {

  let toReturn = {
    links: []
  }

  items.forEach((item) => {
    const ep = parseInt(item.title[0].split(' ').reverse()[1])

    if (ep >= data.fromEp && ep <= data.untilEp)
      toReturn.links.push(item.link[0] + '&magnet=1')
  })

  res.writeHead(200, {"Content-type": "application/json"})
  res.write(JSON.stringify(toReturn))
  res.end()
}

const giveMagnetsHash = (res, items, data) => {
  console.log('User said he preferred having magnets hashes.')

  let toReturn = {
    links: []
  }

  let files = []

  items.forEach((item) => {
    const ep = parseInt(item.title[0].split(' ').reverse()[1])

    if (ep >= data.fromEp && ep <= data.untilEp)
    {
      files.push({
        title: item.title[0],
        link: item.link[0]
      })
    }
  })

  files.forEach((file) => {
    let req = request({
      method: 'GET',
      url: file.link
    })

    // Writing file
    let out = fs.createWriteStream(path.join(DIR, `${file.title}.torrent`))
    req.pipe(out)
  })

  setTimeout(() => {
    // Here we convert the torrent files to magnets
    const dirFiles = fs.readdirSync(DIR)

    // Grabbing all the torrents
    for (let i = 0; i < dirFiles.length; ++i)
    {
      let torrent = dirFiles[i]
      if (path.extname(torrent) === '.torrent')
      {
        const file = fs.readFileSync(path.join(DIR, dirFiles[i]))

        const torrent = parseTorrent(file)

        //noinspection JSUnresolvedVariable
        const torrentHash = torrent.infoHash

        const uri = parseTorrent.toMagnetURI({infoHash: torrentHash})

        toReturn.links.push(uri)
      }
    }

    res.writeHead(200, {"Content-type": "application/json"})
    res.write(JSON.stringify(toReturn))
    res.end()

    // Nyanpasu ~
    player.play(path.join(__dirname, '..', '..', '..', 'static', 'sounds', 'Nyanpasu.m4a'), (err) => {
      if (err) throw err
    })
  }, 800 + (data.untilEp - data.fromEp) * 100)
}

exports.download = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  //noinspection JSUnresolvedVariable
  const withMagnets = query.magnets

  const quality = query.quality
  const name = query.name.replace('_', ' ')
  const fromEp = query.fromEp
  const untilEp = query.untilEp

  const data = {
    quality: quality,
    name: name,
    fromEp: fromEp,
    untilEp: untilEp
  }

  const term = `[${fansub}]+${quality}+${name}`

  console.log(`[Downloader]: Received a request to download '${name}' from ep ${fromEp} to ep ${untilEp}. Processing...`)

  deleteOldTorrents()

  nyaa.searchTerm(term).then((result) => {
    console.log(result.statMsg)

    withMagnets
        ? giveMagnetsHash(res, result.items, data)
        : openMagnets(res, result.items, data)

  }).catch((err) => {
    console.log(`[Downloader]: An error occurred ${err}.`)
    res.writeHead(404, {})
    res.end()
  })
}