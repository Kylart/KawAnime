const {si, pantsu} = require('nyaapi')
const _ = require('lodash')
const {removeUnwanted, Logger} = require('../utils')
const logger = new Logger('Nyaa (Download)')

const sendRes = (object, res) => {
  res.status(200).send(JSON.stringify(object))
}

const formatMagnets = (data, searchData, choice, res) => {
  const magnets = []
  const eps = []
  const isPantsu = choice === 'pantsu'

  data.forEach((elem) => {
    elem.name = removeUnwanted(elem.name)
    const ep = elem.name.split(' ').splice(-2, 1)[0]
      .replace('v2', '')
      .replace('v3', '')
      .replace('v4', '')
    eps.push(ep)

    if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
      magnets.push({
        name: elem.name,
        link: isPantsu ? elem.magnet : elem.links.magnet
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
      fromEp: chunk.fromEp,
      untilEp: chunk.untilEp
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
