const { parseAnime: parse } = require('zettai')
const _ = require('lodash')
const { Logger } = require('../utils')
const logger = new Logger('Nyaa (Download)')

const engines = require('./engines.js')

const sendRes = (object, res) => {
  res
    .status(200)
    .json(object)
}

const formatMagnets = (data, searchData, feed, res) => {
  const magnets = []
  const eps = []
  const isPantsu = feed === 'pantsu'

  data.forEach((elem) => {
    const parsed = Object.assign({}, parse(elem.name))
    const ep = parseInt(parsed.episodeOrMovieNumber)

    eps.push(ep)

    if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
      magnets.push({
        name: parsed.title,
        link: isPantsu ? elem.magnet : elem.links.magnet,
        nb: ep,
        quality: parsed.resolution,
        fansub: parsed.releaseGroup
      })
    }
  })

  sendRes({
    minEp: _.min(eps),
    maxEp: _.max(eps),
    magnets
  }, res)
}

const download = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    const { feed } = chunk

    const searchData = {
      quality: chunk.quality || '',
      name: chunk.name || '',
      fansub: chunk.fansub.replace('None', '') || '',
      fromEp: chunk.fromEp || -Infinity,
      untilEp: chunk.untilEp || Infinity
    }

    logger.info('Received a download request. Feed is ' + feed, searchData)

    const term = `[${searchData.fansub}] ${searchData.quality} ${searchData.name}`

    const engine = engines[feed]

    engine.search(term)
      .then((data) => formatMagnets(data, searchData, feed, res))
      .catch(/* istanbul ignore next */(err) => {
        logger.error('An error occurred.', err)
        res.status(204).send()
      })
  })
}

module.exports = download
