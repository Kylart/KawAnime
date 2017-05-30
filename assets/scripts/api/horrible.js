/**
 * Created by Kylart on 03/05/2017.
 *
 * Rip Nyaa.se May, 1st 2017
 *
 */

const horribleApi = require('horrible-api')
const malScraper = require('mal-scraper')
const qs = require('querystring')

exports.getLatest = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  const quality = query.quality

  let counter = 0
  let toReturn = []

  horribleApi.getLatest(quality.toString()).then((result) => {
    for (let i = 0, l = result.length; i < l; ++i) {
      const realName = result[i].name
      const name = realName.split(' ').slice(1).join(' ')
      const rawName = name.split(' ').slice(0, -2).join(' ')
      const researchName = rawName.split(' ').join('').toLowerCase()
      const ep = name.split(' ').slice(-1)[0]
      const link = result[i].link

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
          console.log('[Horrible] (Releases): Sending Latest releases.')
          res.writeHead(200, {'Content-type': 'application/json'})
          res.write(JSON.stringify(toReturn))
          res.end()
        }
      }).catch(/* istanbul ignore next */ (err) => {
        console.log('[MalScraper] (Releases): An error occurred...\n' + err)
        res.writeHead(202, {})
        res.end()
      })
    }
  }).catch((err) => {
    console.log('[Horrible] (Releases): An error occurred...\n' + err)
    res.writeHead(204, {})
    res.end()
  })
}

exports.download = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    console.log('[Horrible] (Download): Received a download request.')

    const searchData = {
      quality: chunk.quality,
      name: chunk.name,
      fromEp: chunk.fromEp,
      untilEp: chunk.untilEp
    }

    console.log(searchData)

    // Calling api
    horribleApi.getMagnetsFromAnimeName(searchData).then((links) => {
      console.log('[Horrible] (Download): Request fulfilled!')

      res.writeHead(200, {'Content-type': 'application/json'})
      res.write(JSON.stringify(links))
      res.end()
    }).catch((err) => {
      console.log('[Horrible] (Download): An error occurred...\n' + err)
      res.writeHead(204, {})
      res.end()
    })
  })
}

exports.getShowsList = (res) => {
  const list = horribleApi.getShowsOnly()

  res.writeHead(200, {'Content-type': 'application/json'})
  res.write(JSON.stringify(list))
  res.end()
}
