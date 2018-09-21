const {si, pantsu} = require('nyaapi')
const { parseAnime: parse } = require('zettai')
const _ = require('lodash')
const {Logger} = require('../utils')
const logger = new Logger('Nyaa (Download)')

const sendRes = (object, res) => {
  res
    .status(200)
    .json(object)
}

const formatMagnets = (data, searchData, choice, res) => {
  const magnets = []
  const eps = []
  const isPantsu = choice === 'pantsu'

  data.forEach((elem) => {
    const parsed = Object.assign({}, parse(elem.name))
    const ep = parseInt(parsed.episodeOrMovieNumber)

    eps.push(ep)

    if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
      magnets.push({
        name: parsed.title,
        link: isPantsu ? elem.magnet : elem.links.magnet,
        nb: ep
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

    const {choice} = chunk

    const searchData = {
      quality: chunk.quality,
      name: chunk.name,
      fansub: chunk.fansub,
      fromEp: chunk.fromEp || -Infinity,
      untilEp: chunk.untilEp || Infinity
    }

    logger.info('Received a download request. Choice is ' + choice, searchData)

    const term = `[${searchData.fansub}] ${searchData.quality || ''} ${searchData.name} ` + (choice === 'si' ? '-unofficial' : '')

    if (choice === 'si') {
      si.search(term).then((data) => {
        formatMagnets(data, searchData, choice, res)
      }).catch(/* istanbul ignore next */(err) => {
        logger.error('An error occurred.', err)
        res.status(204).send()
      })
    } else {
      pantsu.search(term).then((data) => {
        formatMagnets(data, searchData, choice, res)
      }).catch(/* istanbul ignore next */(err) => {
        logger.error('An error occurred.', err)
        res.status(204).send()
      })
    }
  })
}

module.exports = download
