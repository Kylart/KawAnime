import torrentStream from 'torrent-stream'

import { eventsList } from 'vendor'
import createServer from './createServer'
import { Logger } from '../../utils'

const logger = new Logger('Streaming')

const events = eventsList.streaming

let engine

function init (event, { link }) {
  engine = torrentStream(link)

  engine.on('ready', () => {
    // We stream only the first file for now
    const file = engine.files[0]

    logger.info(`File ready to be streamed ${file.name}`)

    const server = createServer(file)
    server.listen()

    event.sender.send(events.init.success, {
      link,
      name: file.name,
      path: file.path,
      port: server.address().port
    })
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
  { eventName: events.stop.main, handler: shutDown }
]
