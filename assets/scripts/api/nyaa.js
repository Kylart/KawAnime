/**
 * Created by Kylart on 27/05/2017.
 */

import nyaa from 'nyaapi'
import malScraper from 'mal-scraper'
import qs from 'querystring'

const sendRes = (object, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(object))
  res.end()
}

const download = (url, res) => {
  const query = qs.parse(url.replace('?', ''))
  const term = query.term
  const n = query.n || null
  const choice = query.site || 'si'

  if (!term) {
    res.writeHead(204, {})
    res.end()
  } else {
    if (choice === 'si') {
      nyaa.searchSi(term, n).then((data) => {
        const magnets = data.map((elem) => {
          return `magnet:?xt=urn:btih:${elem.infoHash[0]}`
        })

        sendRes(magnets, res)
      }) /* istanbul ignore next */
        .catch((err) => {
          console.log('[Nyaa]: An error occurred...\n' + err)
          res.writeHead(204, {})
          res.end()
        })
    } else {
      nyaa.searchPantsu(term, n).then((data) => {
        const magnets = data.map((elem) => {
          return elem.link[0].split('&')[0]
        })

        sendRes(magnets, res)
      }) /* istanbul ignore next */
        .catch((err) => {
          console.log('[Nyaa]: An error occurred...\n' + err)
          res.writeHead(204, {})
          res.end()
        })
    }
  }
}

const searchOnMal = (i, counter, toReturn, object, res) => {
  malScraper.getResultsFromSearch(object.rawName).then((items) => {
    return malScraper.getInfoFromURI(malScraper.getBestMatch(object.rawName, items))
  }).then((item) => {
    const picture = item.picture
    const fullSynopsis = item.synopsis
    const synopsis = item.synopsis.length > 170
      ? item.synopsis.slice(0, 175) + '...'
      : fullSynopsis

    toReturn[i] = {
      name: object.name,
      rawName: object.rawName,
      researchName: object.researchName,
      ep: object.ep,
      magnetLink: object.link,
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
  }) /* istanbul ignore next */
    .catch((err) => {
      console.log('[MalScraper] (Releases): An error occurred...\n' + err)
      res.writeHead(204, {})
      res.end()
    })
}

const getLatest = (url, res) => {
  const query = qs.parse(url.replace('?', ''))
  const fansub = query.fansub
  const choice = query.choice || 'si'
  const quality = query.quality || '720p'

  let counter = 0
  let toReturn = []

  if (choice === 'si') {
    nyaa.searchSi(`[${fansub}] ${quality}`, 18).then((data) => {
      for (let i = 0; i < 18; ++i) {
        const realName = data[i].title[0]
        const name = realName.split(' ').slice(1).join(' ')
        const rawName = name.split(' ').slice(0, -2).join(' ')
        const researchName = rawName.split(' ').join('').toLowerCase()
        const ep = name.split(' ').slice(-1)[0]
        const link = `magnet:?xt=urn:btih:${data[i].infoHash[0]}`

        const toSearch = {
          realName: realName,
          name: name,
          rawName: rawName,
          researchName: researchName,
          ep: ep,
          link: link
        }

        searchOnMal(i, counter, toReturn, toSearch, res)
      }
    }) /* istanbul ignore next */
      .catch((err) => {
        console.log('[MalScraper] (Releases): An error occurred...\n' + err)
        res.writeHead(204, {})
        res.end()
      })
  } else if (choice === 'pantsu') {
    nyaa.searchPantsu(`[${fansub}] ${quality}`, 18).then((data) => {
      for (let i = 0; i < 18; ++i) {
        const realName = data[i].title[0]
        const name = realName.split(' ').slice(1).join(' ')
        const rawName = name.split(' ').slice(0, -2).join(' ')
        const researchName = rawName.split(' ').join('').toLowerCase()
        const ep = name.split(' ').slice(-1)[0]
        const link = `${data[i].link[0]}`

        const toSearch = {
          realName: realName,
          name: name,
          rawName: rawName,
          researchName: researchName,
          ep: ep,
          link: link
        }

        searchOnMal(i, counter, toReturn, toSearch, res)
      }
    }) /* istanbul ignore next */
      .catch((err) => {
        console.log('[MalScraper] (Releases): An error occurred...\n' + err)
        res.writeHead(204, {})
        res.end()
      })
  }
}

module.exports = {
  download,
  getLatest
}
