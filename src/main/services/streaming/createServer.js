import http from 'http'
import { URL } from 'url'
import pump from 'pump'
import rangeParser from 'range-parser'
import mime from 'mime'

export default function (file) {
  const server = http.createServer()

  server.on('request', (req, res) => {
    const u = new URL(req.url, 'http://localhost')

    // Allow CORS requests to specify arbitrary headers, e.g. 'Range',
    // by responding to the OPTIONS preflight request with the specified
    // origin and requested headers.
    if (req.method === 'OPTIONS' && req.headers['access-control-request-headers']) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
      res.setHeader('Access-Control-Max-Age', '1728000')

      res.end()
      return
    }

    if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

    if (u.pathname === '/favicon.ico') {
      res.statusCode = 404
      res.end()
      return
    }

    var range = req.headers.range
    range = range && rangeParser(file.length, range)[0]

    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Type', mime.getType(file.name))
    res.setHeader('transferMode.dlna.org', 'Streaming')
    res.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000')

    if (!range) {
      res.setHeader('Content-Length', file.length)
      if (req.method === 'HEAD') return res.end()

      pump(file.createReadStream(), res)
      return
    }

    res.statusCode = 206
    res.setHeader('Content-Length', range.end - range.start + 1)
    res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
    if (req.method === 'HEAD') return res.end()

    pump(file.createReadStream(range), res)
  })

  server.on('connection', function (socket) {
    socket.setTimeout(36000000)
  })

  return server
}
