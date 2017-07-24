/**
 * Created by Kylart on 11/04/2017.
 */

const {getNewsNoDetails} = require('mal-scraper')

/* istanbul ignore next */
exports.getNews = (res) => {
  getNewsNoDetails().then((news) => {
    console.log('[Mal-Scraper] (News): Finished gathering the news.')

    res.type('application/json')
    res.status(200).send(JSON.stringify(news))
  }).catch((err) => {
    console.log('[Mal-Scraper] (News): A problem occurred while gathering news.')
    console.error(err.message)

    res.type('application/json')
    res.status(204).send(JSON.stringify([]))
  })
}
