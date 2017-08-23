/**
 * Created by Kylart on 27/05/2017.
 */

const nyaa = require('nyaapi')
const malScraper = require('mal-scraper')
const {removeUnwanted} = require('./utils')

const sendRes = (object, res) => {
  res.status(200).send(JSON.stringify(object))
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

    const term = `[${searchData.fansub}]+${searchData.quality}+${searchData.name}+` + (choice === 'si' ? '-unofficial' : '')

    if (choice === 'si') {
      nyaa.searchSi(term).then((data) => {
        const magnets = []

        data.forEach((elem) => {
          elem.title[0] = removeUnwanted(elem.title[0])
          const ep = elem.title[0].split(' ').splice(-2, 1)[0]

          if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
            magnets.push(`magnet:?xt=urn:btih:${elem['nyaa:infoHash'][0]}`)
          }
        })

        sendRes(magnets, res)
      }).catch(/* istanbul ignore next */(err) => {
        console.log('[Nyaa]: An error occurred...\n' + err)
        res.status(204).send()
      })
    } else {
      nyaa.searchPantsu(term).then((data) => {
        const magnets = []

        data.forEach((elem) => {
          elem.title[0] = removeUnwanted(elem.title[0])
          const ep = parseInt(elem.title[0].split(' ').splice(-2, 1)[0])

          if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
            magnets.push('magnet:?xt=urn:btih:' + elem.link[0].split('/').slice(-1))
          }
        })

        sendRes(magnets, res)
      }).catch(/* istanbul ignore next */(err) => {
        console.log(err.message)
        res.status(204).send()
      })
    }
  })
}

// TODO remove this wtf ?
/* istanbul ignore next */
const getLatest = (query, res) => {
  const fansub = query.fansub
  const choice = query.choice
  const quality = query.quality

  let counter = 0
  let toReturn = []

  if (choice === 'si') {
    nyaa.searchSi(`[${fansub}] ${quality} -unofficial`, 18).then((data) => {
      for (let i = 0; i < 18; ++i) {
        const realName = removeUnwanted(data[i].title[0])
        const name = realName.split(' ').slice(1).join(' ')
        const rawName = name.split(' ').slice(0, -3).join(' ')
        const researchName = rawName.split(' ').join('').toLowerCase()
        const ep = name.split(' ').splice(-2, 1)[0]
        const link = `magnet:?xt=urn:btih:${data[i]['nyaa:infoHash'][0]}`

        malScraper.getResultsFromSearch(rawName).then((items) => {
          return malScraper.getInfoFromURI(malScraper.getBestMatch(rawName, items))
        }).then((item) => {
          const picture = item.picture
          const fullSynopsis = item.synopsis
          const synopsis = item.synopsis.length > 170
            ? item.synopsis.slice(0, 175) + '...'
            : fullSynopsis

          toReturn[i] = {
            name: name,
            rawName: rawName,
            researchName: researchName,
            ep: ep,
            magnetLink: link,
            picture: picture,
            synopsis: synopsis,
            fullSynopsis: fullSynopsis
          }

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
    }).catch(/* istanbul ignore next */(err) => {
      console.log('[Nyaa] (Releases): An error occurred...\n' + err)
      res.status(204).send()
    })
  } else if (choice === 'pantsu') {
    nyaa.searchPantsu(`[${fansub}] ${quality}`, 18).then((data) => {
      for (let i = 0; i < 18; ++i) {
        const realName = removeUnwanted(data[i].title[0])
        const name = realName.split(' ').slice(1).join(' ')
        const rawName = name.split(' ').slice(0, -3).join(' ')
        const researchName = rawName.split(' ').join('').toLowerCase()
        const ep = name.split(' ').slice(-1)[0]
        const link = `${data[i].link[0]}`

        malScraper.getResultsFromSearch(rawName).then((items) => {
          return malScraper.getInfoFromURI(malScraper.getBestMatch(rawName, items))
        }).then((item) => {
          const picture = item.picture
          const fullSynopsis = item.synopsis
          const synopsis = item.synopsis.length > 170
            ? item.synopsis.slice(0, 175) + '...'
            : fullSynopsis

          toReturn[i] = {
            name: name,
            rawName: rawName,
            researchName: researchName,
            ep: ep,
            magnetLink: link,
            picture: picture,
            synopsis: synopsis,
            fullSynopsis: fullSynopsis
          }

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
    }).catch(/* istanbul ignore next */(err) => {
      console.log('[Nyaa] (Releases): An error occurred...\n' + err)
      res.status(204).send()
    })
  }
}

module.exports = {
  download,
  getLatest
}
