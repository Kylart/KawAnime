/**
 * Created by Kylart on 27/05/2017.
 */

const {si, pantsu} = require('nyaapi')
const malScraper = require('mal-scraper')
const _ = require('lodash')
const {removeUnwanted} = require('./utils')

const sendRes = (object, res) => {
  res.status(200).send(JSON.stringify(object))
}

const formatMagnets = (data, searchData, choice, res) => {
  const magnets = []
  const eps = []
  const isPantsu = choice === 'pantsu'

  data.forEach((elem) => {
    elem.name = removeUnwanted(elem.name)
    const ep = elem.name.split(' ').splice(-2, 1)[0]
    eps.push(ep)

    if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
      magnets.push({
        name: elem.name,
        link: isPantsu ? elem.magnet : elem.links.magnet
      })
    }
  })

  sendRes({
    minEp: _.min(eps),
    maxEp: _.max(eps),
    magnets
  }, res)
}

const download = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    const choice = chunk.choice

    console.log('[Nyaa] (Download): Received a download request. Choice is ' + choice)

    const searchData = {
      quality: chunk.quality,
      name: chunk.name,
      fansub: chunk.fansub,
      fromEp: chunk.fromEp,
      untilEp: chunk.untilEp
    }

    console.log(searchData)

    const term = `[${searchData.fansub}] ${searchData.quality} ${searchData.name} ` + (choice === 'si' ? '-unofficial' : '')

    if (choice === 'si') {
      si.search(term).then((data) => {
        formatMagnets(data, searchData, choice, res)
      }).catch(/* istanbul ignore next */(err) => {
        console.log('[Nyaa]: An error occurred...\n' + err)
        res.status(204).send()
      })
    } else {
      pantsu.search(term).then((data) => {
        formatMagnets(data, searchData, choice, res)
      }).catch(/* istanbul ignore next */(err) => {
        console.log(err.message)
        res.status(204).send()
      })
    }
  })
}

const makeSearch = (data, res, isPantsu = false) => {
  let counter = 0
  const toReturn = []

  for (let i = 0; i < 18; ++i) {
    const realName = removeUnwanted(data[i].name)
    const name = realName.split(' ').slice(1).join(' ')
    const rawName = name.split(' ').slice(0, -3).join(' ')
    const researchName = rawName.split(' ').join('').toLowerCase()
    const ep = name.split(' ').splice(-2, 1)[0]
    const link = !isPantsu ? data[i].links.magnet : data[i].magnet

    malScraper.getInfoFromName(rawName)
      .then((item) => {
        item.rawName = rawName
        item.researchName = researchName
        item.magnetLink = link
        item.ep = ep
        item.synopsis = item.synopsis.length > 170
          ? item.synopsis.slice(0, 175) + '...'
          : item.synopsis

        toReturn[i] = item

        ++counter
        if (counter === 18) {
          console.log('[Nyaa] (Releases): Sending Latest releases.')
          res.writeHead(200, {'Content-type': 'application/json'})
          res.write(JSON.stringify(toReturn))
          res.end()
        }
      }).catch(/* istanbul ignore next */(err) => {
        console.log('[MalScraper] (Releases): An error occurred...\n' + err)
        res.status(202).send()
      })
  }
}

const getLatest = (query, res) => {
  const fansub = query.fansub
  const choice = query.choice
  const quality = query.quality

  if (choice === 'si') {
    si.search(`[${fansub}] ${quality} -unofficial`, 18).then((data) => {
      makeSearch(data, res)
    }).catch(/* istanbul ignore next */(err) => {
      console.log('[Nyaa] (Releases): An error occurred...\n', err)
      res.status(204).send()
    })
  } else {
    pantsu.search(`[${fansub}] ${quality}`, 18).then((data) => {
      makeSearch(data, res, true)
    }).catch(/* istanbul ignore next */(err) => {
      console.log('[Nyaa] (Releases): An error occurred...\n', err)
      res.status(204).send()
    })
  }
}

module.exports = {
  download,
  getLatest
}
