/**
 * Created by Kylart on 03/05/2017.
 *
 * Rip Nyaa.se May, 1st 2017
 *
 */

const horribleApi = require('horrible-api')
const malScraper = require('mal-scraper')

const {Logger} = require('../utils')
const horribleLogger = new Logger('Horrible (Releases)')
const malLogger = new Logger('Mal-Scraper (Releases)')

exports.getLatest = ({query}, res) => {
  const {quality} = query

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
          /* istanbul ignore next */
          if (counter === 18) {
            horribleLogger.info('Sending latest releases.')
            res.type('application/json')
            res.status(200).send(JSON.stringify(toReturn))
          }
        })
        .catch(/* istanbul ignore next */ (err) => {
          malLogger.error('An error occurred.', err)
          res.status(202).send()
        })
    }
  }).catch((err) => {
    horribleLogger.error('An error occurred.', err)
    res.status(204).send()
  })
}
