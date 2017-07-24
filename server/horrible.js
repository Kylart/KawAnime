/**
 * Created by Kylart on 03/05/2017.
 *
 * Rip Nyaa.se May, 1st 2017
 *
 */

const horribleApi = require('horrible-api')
const malScraper = require('mal-scraper')

exports.getLatest = (query, res) => {
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
        /* istanbul ignore next */
        if (counter === 18) {
          console.log('[Horrible] (Releases): Sending Latest releases.')
          res.type('application/json')
          res.status(200).send(JSON.stringify(toReturn))
        }
      }).catch(/* istanbul ignore next */ (err) => {
        console.log('[MalScraper] (Releases): An error occurred...\n' + err)
        res.status(202).send()
      })
    }
  }).catch((err) => {
    console.log('[Horrible] (Releases): An error occurred...\n' + err)
    res.status(204).send()
  })
}
