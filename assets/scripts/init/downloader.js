/**
 * Created by Kylart on 05/04/2017.
 */

const nyaa = require('nyaapi')
const qs = require('querystring')

const fansub = 'HorribleSubs'

exports.download = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  const quality = query.quality
  const name = query.name.replace('_', ' ')
  const fromEp = query.fromEp
  const untilEp = query.untilEp

  const term = `[${fansub}]+${quality}+${name}`

  console.log(`[Downloader]: Received a request to download '${name}' from ep ${fromEp} to ep ${untilEp}. Processing...`)

  nyaa.searchTerm(term).then((result) => {
    console.log(result.statMsg)

    let toReturn = {
      links: []
    }

    result.items.forEach((item) => {
      const ep = parseInt(item.title[0].split(' ').reverse()[1])

      if (ep >= fromEp && ep <= untilEp)
        toReturn.links.push(item.link[0] + '&magnet=1')
    })

    res.writeHead(200, {"Content-type": "application/json"})
    res.write(JSON.stringify(toReturn))
    res.end()
  }).catch((err) => {
    console.log(`[Downloader]: An error occurred ${err}.`)
    res.writeHead(404, {})
    res.end()
  })
}