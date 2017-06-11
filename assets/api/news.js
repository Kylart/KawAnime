/**
 * Created by Kylart on 11/04/2017.
 */

const {getNewsNoDetails} = require('mal-scraper')

exports.getNews = (res) => {
  getNewsNoDetails().then((news) => {
    console.log('[Mal-Scraper] (News): Finished gathering the news.')

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.write(JSON.stringify(news))
    res.end()
  }).catch(/* istanbul ignore next */ (err) => {
    console.log('[Mal-Scraper] (News): A problem occurred while gathering news.')
    console.error(err.message)

    res.writeHead(204, {'Content-Type': 'application/json'})
    res.write(JSON.stringify([]))
    res.end()
  })
}
