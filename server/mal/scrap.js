const malScraper = require('mal-scraper')

const getWatchList = (query, res) => {
  const {user} = query

  console.log('[Mal-Scraper]: Looking for the watch lists of', user + '...')

  malScraper.getWatchListFromUser(user)
    .then((data) => res.send(data))
    .catch(/* istanbul ignore next */ (err) => {
      console.log('[Mal-Scraper]: An error occurred while gathring watchLIst from user...', err)
      res.status(204).send()
    })
}

module.exports = {
  getWatchList
}
