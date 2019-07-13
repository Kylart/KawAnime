import { createReadStream, statSync } from 'fs'
import { createServer } from 'http'
import parseRange from 'range-parser'
import { getType } from 'mime'

import { Logger } from '../../utils'

const logger = new Logger('Video (Server)')
const isDev = process.env.NODE_ENV === 'development'

const sockets = []

function onConnection (socket) {
  socket.setTimeout(36000000)
  sockets.push(socket)
  socket.once('close', () => {
    sockets.splice(
      sockets.indexOf(socket),
      1
    )
  })
}

function handleFile (path) {
  const mimeType = getType(path)
  const { size } = statSync(path)

  return {
    path,
    size,
    mimeType
  }
}

function handleRequest (path) {
  return (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Prevent browser mime-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (req.method === 'HEAD') return res.end()

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Max-Age', '600')
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD')

      if (req.headers['access-control-request-headers']) {
        res.setHeader(
          'Access-Control-Allow-Headers',
          req.headers['access-control-request-headers']
        )
      }

      res.statusCode = 204

      return res.end()
    }

    if (req.method === 'GET') {
      const { size, mimeType } = handleFile(path)
      isDev && logger.info(`Streaming ${mimeType}: ${path}`)

      // Support range-requests
      res.setHeader('Content-Type', getType(mimeType))
      res.setHeader('Accept-Ranges', 'bytes')

      // Support DLNA streaming
      res.setHeader('transferMode.dlna.org', 'Streaming')
      res.setHeader(
        'contentFeatures.dlna.org',
        'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
      )

      let range = parseRange(size, req.headers.range || '')

      if (Array.isArray(range)) {
        range = range[0]

        res.statusCode = 206

        res.setHeader('Content-Length', range.end - range.start + 1)
        res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${size}`)
      } else {
        // Here range is either -1 or -2
        res.setHeader('Content-Length', size)
        range = null
      }

      const stream = createReadStream(path, range)

      const close = () => {
        if (stream) {
          isDev && logger.info(`Closing stream of range: ${JSON.stringify(range)} for file ${path}`)
          stream.destroy()
        }
      }

      res.once('close', close)
      res.once('error', close)
      res.once('finish', close)
      stream.pipe(res)
    }
  }
}

export default function (path) {
  const server = createServer()

  server.on('connection', onConnection)
  server.on('request', handleRequest(path))

  server.close = () => {
    server.removeListener('connection', onConnection)
    server.removeListener('request', handleRequest(path))

    sockets.forEach((socket) => socket.destroy())
  }

  return server
}
