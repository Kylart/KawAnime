const fs = require('fs')
const WebTorrent = require('webtorrent')
const parseRange = require('range-parser')
const mime = require('mime')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Streamer')
const decode = require('urldecode')
const MatroskaSubtitles = require('matroska-subtitles')

let client = null

const stream = (req, res) => {
  if (!client) {
    client = process.torrentClient = new WebTorrent()
  }

  const info = decode(req.url.slice('/stream/'.length))
  const isMagnet = /^magnet:\?/.test(info)
  const type = isMagnet ? 'magnet' : 'file'

  const path = isMagnet ? null : info
  const magnet = isMagnet ? info : null

  const stat = path && fs.statSync(path)

  logger.info(`Streaming ${type}: ${isMagnet ? magnet : path}`)

  const processFile = (obj = { files: [] }) => {
    const { files: [torrent] } = obj

    const size = isMagnet ? torrent.length : stat.size

    const mimeType = mime.getType(path || torrent.name)

    res.set({
      'Content-Type': mime.getType(mimeType),
      'Accept-Ranges': 'bytes'
    })

    let range = parseRange(size, req.headers.range || '')

    if (Array.isArray(range)) {
      range = range[0]

      res
        .status(206)
        .set({
          'Content-Range': `bytes ${range.start}-${range.end}/${size}`,
          'Content-Length': range.end - range.start + 1
        })
    } else {
      // Here range is either -1 or -2
      res.setHeader('Content-Length', size)
      range = null
    }

    if (req.method === 'HEAD') { res.end() } else {
      let stream = isMagnet
        ? torrent.createReadStream(range)
        : fs.createReadStream(path, range)

      const close = () => {
        if (stream) {
          logger.info(`Closing stream of range: ${JSON.stringify(range)} for ${type}: ${isMagnet ? magnet : path}`)
          stream.destroy()
          torrent && torrent.deselect(range)
          stream = null

          process.torrent = null
        }
      }

      res.once('close', close)
      res.once('error', close)
      res.once('finish', close)
      stream.pipe(res)
    }
  }

  if (isMagnet) {
    const torrent = client.get(magnet)

    if (torrent) {
      if (torrent.ready) {
        processFile(torrent)
      } else {
        torrent.once('ready', () => processFile(torrent))
      }
    } else {
      client.add(magnet, processFile)
    }
  } else {
    processFile()
  }
}

const tracks = (req, res) => {
  const info = decode(req.url.slice('/tracks/'.length))
  const isMagnet = /^magnet:\?/.test(info)
  const type = isMagnet ? 'magnet' : 'file'

  const path = isMagnet ? null : info
  const magnet = isMagnet ? info : null

  logger.info(`Tracks for ${type}: ${isMagnet ? magnet : path}`)

  const processFile = (obj = {files: []}) => {
    const { files: [torrent] } = obj
    const mimeType = mime.getType(path || torrent.name)

    if (mimeType === 'video/x-matroska') {
      const parser = new MatroskaSubtitles()
      let stream = isMagnet
        ? torrent.createReadStream()
        : fs.createReadStream(path)

      parser.on('tracks', tracks => res.sse('tracks', tracks))

      parser.on('subtitle', (subtitle, trackNumber) => res.sse('subtitle', {
        subtitle,
        trackNumber
      }))

      const close = () => {
        if (stream) {
          logger.info(`Closing stream for ${type} tracks: ${isMagnet ? magnet : path}`)
          stream.destroy()
          torrent && torrent.deselect()
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

  processFile(isMagnet ? client.get(magnet) : undefined)
}

module.exports = {stream, tracks}
