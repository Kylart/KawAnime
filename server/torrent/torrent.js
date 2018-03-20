const WebTorrent = require('webtorrent')
const parseRange = require('range-parser')
const mime = require('mime')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Streamer')
const decode = require('urldecode')
const MatroskaSubtitles = require('matroska-subtitles')

const client = new WebTorrent()

const stream = (req, res) => {
  const magnet = decode(req.url.slice('/stream/'.length))
  logger.info(`Streaming magnet: ${magnet}`)

  const processTorrent = ({ files: [torrent] }) => {
    const mimeType = mime.getType(torrent.name)
    logger.info(`Video mime-type: "${mimeType}"`)
    res.set({
      'Content-Type': mime.getType(mimeType),
      'Accept-Ranges': 'bytes'
    })

    let range = parseRange(torrent.length, req.headers.range || '')
    if (Array.isArray(range)) {
      range = range[0]

      res.status(206)
          .set({
            'Content-Range': `bytes ${range.start}-${range.end}/${torrent.length}`,
            'Content-Length': range.end - range.start + 1
          })
    } else {
      res.setHeader('Content-Length', torrent.length)
    }
    if (req.method === 'HEAD') { res.end() } else {
      let stream = torrent.createReadStream(range)
      const close = () => {
        if (stream) {
          logger.info(`Closing stream of range: ${JSON.stringify(range)} for magnet: ${magnet}`)
          stream.destroy()
          torrent.deselect(range)
          stream = null
        }
      }

      res.once('close', close)
      res.once('error', close)
      res.once('finish', close)
      stream.pipe(res)
    }
  }

  const torrent = client.get(magnet)

  if (torrent) {
    if (torrent.ready) {
      processTorrent(torrent)
    } else {
      torrent.once('ready', () => processTorrent(torrent))
    }
  } else {
    client.add(magnet, processTorrent)
  }
}
const tracks = (req, res) => {
  const magnet = decode(req.url.slice('/tracks/'.length))
  logger.info(`Tracks for Magnet magnet: ${magnet}`)

  const processTorrent = ({ files: [torrent] }) => {
    const mimeType = mime.getType(torrent.name)
    if (mimeType === 'video/x-matroska') {
      const parser = new MatroskaSubtitles()
      let stream = torrent.createReadStream()

      parser.once('tracks', tracks => res.sse('tracks', tracks))

      parser.on('subtitle', (subtitle, trackNumber) => res.sse('subtitle', {
        subtitle,
        trackNumber
      }))

      const close = () => {
        if (stream) {
          logger.info(`Closing stream for magnet tracks: ${magnet}`)
          stream.destroy()
          torrent.deselect()
          stream = null
        }
      }

      res.once('close', close)
      res.once('error', close)
      res.once('finish', close)
      stream.pipe(parser)
    } else {
      res.end()
    }
  }

  const torrent = client.get(magnet)

  if (torrent) {
    if (torrent.ready) {
      processTorrent(torrent)
    } else {
      torrent.once('ready', () => processTorrent(torrent))
    }
  } else {
    client.add(magnet, processTorrent)
  }
}

module.exports = {stream, tracks}
