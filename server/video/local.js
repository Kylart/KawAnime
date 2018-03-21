const fs = require('fs')
const MatroskaSubtitles = require('matroska-subtitles')
const { Logger } = require('../utils')

const logger = new Logger('Local')

const getSubtitles = (req, res) => {
  const { query: { path } } = req
  logger.info('Extracting subtitles from file:', path)

  const parser = new MatroskaSubtitles()

  parser.once('tracks', tracks => res.sse('tracks', tracks))

  parser.on('subtitle', (subtitle, trackNumber) => res.sse('subtitle', {
    subtitle,
    trackNumber
  }))

  fs.createReadStream(path).pipe(parser)
}

module.exports = {
  getSubtitles
}
