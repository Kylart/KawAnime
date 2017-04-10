/**
 * Created by Kylart on 03/04/2017.
 */

const malScraper = require('mal-scraper')
const qs = require('querystring')

exports.getSeason = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  malScraper.getSeason(query.year, query.season).then((result) => {
    console.log(`Now having ${query.season} ${query.year}.`)

    res.writeHead(200, {"Content-Type": "application/json"})
    res.write(JSON.stringify(result))
    res.end()
  }).catch((err) => {
    console.log(err)
  })
}

