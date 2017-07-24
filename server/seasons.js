/**
 * Created by Kylart on 03/04/2017.
 */

const malScraper = require('mal-scraper')

exports.getSeason = (query, res) => {
  malScraper.getSeason(query.year, query.season).then((result) => {
    console.log(`[Mal-Scraper] (Seasons): Now having ${query.season} ${query.year}.`)

    const keys = Object.keys(result.info)

    keys.forEach((key) => {
      result.info[key].forEach((elem, index) => {
        result.info[key][index].key = Math.random()
      })
    })

    res.type('application/json')
    res.status(200).send(JSON.stringify(result))
  }).catch((err) => {
    console.log('[MalScraper] (Seasons): ' + err.message)
    res.status(204).send()
  })
}
