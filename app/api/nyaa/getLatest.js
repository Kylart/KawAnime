const { parseAnime: parse } = require('zettai')
const { Logger } = require('../utils')
const logger = new Logger('Nyaa (Releases)')

const engines = require('./engines.js')

const getLatest = ({ query: { feed, quality, term, fansub = '' } }, res) => {
  // This method will only return the raw feed from
  // the source, if a search must be done, it must be done
  // after receiving those data.
  fansub = fansub.replace('None', '')
    ? `[${fansub}]`
    : ''

  // Currently, feed can only be 'pantsu' or 'si'
  const query = [fansub, quality, term].join(' ')
  const engine = engines[feed]

  const result = []

  // Seriously, 150 entries should suffice.
  engine.search(query, 150, { filter: '0', category: '1_0' })
    .then((data) => {
      data.forEach((elem) => {
        const tmp = elem

        // We have to copy the result of `parse` so that
        // parsedName won't be always a reference to the same
        // variable...
        tmp.parsedName = Object.assign({}, parse(elem.name))

        result.push(tmp)
      })

      logger.info('Sending latest releases.')
      res.json(result)
    })
    .catch((err) => {
      logger.error('Error while getting the releases', err)
      res.status(204).send()
    })
}

module.exports = getLatest
