import { createReadStream } from 'fs'

import generateServer from './createServer'
import { eventsList } from 'vendor'
import { parseSubtitles } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.video

const logger = new Logger('Video')
let server
let subtitleStream

function closeServer (event) {
  try {
    server && server.close()
    subtitleStream && subtitleStream.close()

    event.sender.send(events.stop.success)

    logger.info('Closed local video server.')
  } catch (e) {
    logger.error('Could not close server.', e)
  }
}

function readVideo (event, { name, link: path }) {
  server = generateServer(path)

  server.listen()
  const address = server.address()

  logger.info(`Created video server for ${path} at ${address.port}`)
  event.sender.send(events.init.success, { name, path, port: address.port })

  subtitleStream = createReadStream(path)
  parseSubtitles(event, subtitleStream)
}

export default [{
  eventName: events.init.main,
  handler: readVideo
}, {
  eventName: events.stop.main,
  handler: closeServer
}]
