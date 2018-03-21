const fs = require('fs')
const WebTorrent = require('webtorrent')
const parseRange = require('range-parser')
const mime = require('mime')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Streamer')
const decode = require('urldecode')
const MatroskaSubtitles = require('matroska-subtitles')

const client = process.torrentClient = new WebTorrent()

const stream = (req, res) => {
  // Getting magnet hash
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

      res
        .status(206)
        .set({
          'Content-Range': `bytes ${range.start}-${range.end}/${torrent.length}`,
          'Content-Length': range.end - range.start + 1
        })
    } else {
      // Means that parseRange a parsing error occurred.
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

  // const torrent = client.get(magnet)

  // if (torrent) {
  //   if (torrent.ready) {
  //     processTorrent(torrent)
  //   } else {
  //     torrent.once('ready', () => processTorrent(torrent))
  //   }
  // } else {
  //   client.add(magnet, processTorrent)
  // }
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

      parser.once('tracks', tracks => res.sse('tracks', tracks))

      parser.on('subtitle', (subtitle, trackNumber) => res.sse('subtitle', {
        subtitle,
        trackNumber
      }))

      const close = () => {
        if (stream) {
          logger.info(`Closing stream for ${type} tracks: ${magnet}`)
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

  if (magnet) {
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

module.exports = {stream, tracks}
