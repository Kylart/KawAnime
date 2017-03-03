/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file, all the functions needed by the downloader page
 * are present. This is for cleaner code.
 *
 */

// Those are needed to download the torrents
const fs = require('fs')
const path = require('path')
const req = require('request')
const request = require('request')
const findRemoveSync = require('find-remove')
const parseTorrent = require('parse-torrent')

// Nyanpasu ~
const player = require('play-sound')(opts = {})

// Nyaa API
const Nyaa = require('node-nyaa-api')

const os = require('os')
const DIR = path.join(os.userInfo().homedir, '.KawAnime')

const downloadFile= (file_url, name) => {
  let req = request({
    method: 'GET',
    uri: file_url
  })

  let out = fs.createWriteStream(path.join(DIR, `${name}.torrent`))
  req.pipe(out)
}

exports.download = (object) => {
  console.log(`Retrieving ${object.animeName} from ${object.fromEp} to ${object.untilEp}...`)

  const quality = object.quality
  const animeName = object.animeName
  const fromEp = object.fromEp
  const untilEp = object.untilEp

  Nyaa.search(`[HorribleSubs] ${quality} ${animeName}`, (err, articles) => {
    if (err) throw err

    let animes = []

    for (let article in articles)
      animes.push(articles[article])

    animes.forEach((elem) => {
      const url = elem.link
      const epNumber = parseInt(elem.title.split(' ').reverse()[1])

      if (epNumber >= fromEp && epNumber <= untilEp)
        window.open(`${url}&magnet=1`)
    })
  })
}

exports.downloadMagnets = (object) => {
  console.log(`Retrieving ${object.animeName} from ${object.fromEp} to ${object.untilEp}...`)

  // Removing old torrents
  findRemoveSync(DIR, {extensions: ['.torrent']})

  const quality = object.quality
  const animeName = object.animeName
  const fromEp = object.fromEp
  const untilEp = object.untilEp

  // TODO : Need to make only 10 by 10 downloads
  Nyaa.search(`[HorribleSubs] ${quality} ${animeName}`, (err, articles) => {
    if (err) throw err

    let animes = []

    for (let article in articles)
      animes.push(articles[article])

    animes.forEach((elem) => {
      const url = elem.link
      const epNumber = parseInt(elem.title.split(' ').reverse()[1])
      const name = elem.title.split(' ').slice(0, -1).join(' ')

      // Downloading torrent files
      if (epNumber >= fromEp && epNumber <= untilEp)
        downloadFile(url, name) // TODO : implement a method to know when the files are done downloading
    })

    // Need to wait for the downloads to be over
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

          const name = torrent.name
          const torrentHash = torrent.infoHash
          const date = new Date()

          const uri = parseTorrent.toMagnetURI({infoHash: torrentHash})

          fs.appendFileSync(path.join(DIR, 'magnets.txt'), `${date}: ${name}\n\t`)
          fs.appendFileSync(path.join(DIR, 'magnets.txt'), `${uri}\n\n`)
        }
      }

      object.openSnackbar()

      // Nyanpasu! ~
      player.play(path.join(__dirname, '..', '..', 'resources', 'Nyanpasu.m4a'), (err) => {
        if (err) throw err
      })
    }, 600 + (untilEp - fromEp) * 100)
  })
}