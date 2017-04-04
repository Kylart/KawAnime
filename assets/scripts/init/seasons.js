/**
 * Created by Kylart on 03/04/2017.
 */

const malScraper = require('mal-scraper')
const qs = require('querystring')

exports.getSeason = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  let seasonalInfo = malScraper.getSeason(query.year, query.season, () => {
    console.log(`Now having ${query.season} ${query.year}.`)

    res.writeHead(200, {"Content-Type": "application/json"})
    res.write(JSON.stringify(seasonalInfo))
    res.end()
  })
}

