/**
 * Created by Kylart on 27/06/2017.
 */

const qs = require('querystring')
const axios = require('axios')
const malScraper = require('mal-scraper')

const SEARCH_URI = 'https://myanimelist.net/search/prefix.json'

const searchTerm = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  axios.get(SEARCH_URI, {
    params: {
      type: 'anime',
      keyword: query.term
    }
  }).then(({data}) => {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.write(JSON.stringify(data))
    res.end()
  }).catch(/* istanbul ignore next */(e) => {
    console.log('[Search] (Term):' + e.message)
    res.writeHead(204, {})
    res.end()
  })
}

const searchOnMal = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  malScraper.getInfoFromName(query.term).then((data) => {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.write(JSON.stringify(data))
    res.end()
  }).catch((err) => {
    console.log(err.message)
    res.writeHead(204, {})
    res.end()
  })
}

module.exports = {
  searchTerm,
  searchOnMal
}
