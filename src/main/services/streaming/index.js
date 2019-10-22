import { finished } from 'stream'
import torrentStream from 'torrent-stream'
import Matroska from 'matroska-subtitles'

import { eventsList } from 'vendor'
import createServer from './createServer'
import { Logger } from '../../utils'

const logger = new Logger('Streaming')

const events = eventsList.streaming
const subEvents = eventsList.video

let engine
let subtitleStream = null
let subIntervalId = null

function initParser (event) {
  const parser = new Matroska()

  parser.once('tracks', (tracks) => {
    event.sender.send(subEvents.tracks.success, tracks)
  })

  parser.on('subtitle', (subtitle, trackNumber) => {
    event.sender.send(subEvents.subtitles.success, { subtitle, trackNumber })
  })

  return parser
}

function init (event, { link }) {
  engine = torrentStream(link)

  engine.on('ready', () => {
    // We stream only the first file for now
    const file = engine.files[0]

    logger.info(`File ready to be streamed ${file.name}`)

    const server = createServer(file)
    server.listen()

    event.sender.send(events.init.success, { torrent: link, name: file.name, path: file.path, port: server.address().port })
  })

  // Pause/Resume downloading as needed
  engine.on('uninterested', () => {
    engine.swarm.pause()
  })

  engine.on('interested', () => {
    engine.swarm.resume()
  })

  engine.listen()
}

function streamSubs (event) {
  const parser = initParser(event)

  subIntervalId && clearInterval(subIntervalId)

  const stream = () => {
    const file = engine.files[0]

    subtitleStream = file.createReadStream()
    subtitleStream.pipe(parser)
  }

  const createStream = () => {
    stream()

    subIntervalId = setInterval(() => {
      if (subtitleStream) {
        finished(subtitleStream, (err) => {
          if (err) console.error(err)

          stream()
        })
      }
    }, 300)
  }

  createStream()
}

function shutDown (event) {
  if (engine) {
    engine.destroy(() => {
      logger.info('No longer streaming.')
      event.sender.send(events.subs.success)
    })
  }
}

export default [
  { eventName: events.init.main, handler: init },
  { eventName: events.stop.main, handler: shutDown },
  { eventName: events.subs.main, handler: streamSubs }
]
