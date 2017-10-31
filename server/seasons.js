/**
 * Created by Kylart on 03/04/2017.
 */

const {getSeason} = require('mal-scraper')

exports.getSeason = (query, res) => {
  getSeason(query.year, query.season).then((data) => {
    console.log(`[Mal-Scraper] (Seasons): Now having ${query.season} ${query.year}.`)

    const keys = Object.keys(data)

    keys.forEach((key) => {
      data[key].forEach((elem, index) => {
        data[key][index].key = Math.random()
      })
    })

    res.type('application/json')
    res.status(200).send(JSON.stringify(data))
  }).catch((err) => {
    console.log('[MalScraper] (Seasons): ' + err.message)
    res.status(204).send()
  })
}
