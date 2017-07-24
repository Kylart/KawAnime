/**
 * Created by Kylart on 27/06/2017.
 */

const axios = require('axios')
const malScraper = require('mal-scraper')

const SEARCH_URI = 'https://myanimelist.net/search/prefix.json'

const searchTerm = (query, res) => {
  axios.get(SEARCH_URI, {
    params: {
      type: 'anime',
      keyword: query.term
    }
  }).then(({data}) => {
    res.type('application/json')
    res.status(200).send(JSON.stringify(data))
  }).catch(/* istanbul ignore next */(e) => {
    console.log('[Search] (Term):' + e.message)
    res.status(204).send()
  })
}

const searchOnMal = (query, res) => {
  malScraper.getInfoFromName(query.term).then((data) => {
    res.type('application/json')
    res.status(200).send(JSON.stringify(data))
  }).catch(/* istanbul ignore next */(err) => {
    console.log(err.message)
    res.status(204).send()
  })
}

module.exports = {
  searchTerm,
  searchOnMal
}
