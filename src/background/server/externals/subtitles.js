import MatroskaSubtitles from 'matroska-subtitles'
import { Throttle } from 'stream-throttle'
import { Logger } from '../utils'
import { eventsList } from '../../../vendor'

const logger = new Logger('Subtitles')
const events = eventsList.video

function generateHandlers (event) {
  return {
    tracks: (tracks) => event.sender.send(events.tracks.success, tracks),
    subtitle: (subtitle, trackNumber) => event.sender.send(events.subtitles.success, { subtitle, trackNumber })
  }
}

function generateParser (handlers) {
  const parser = new MatroskaSubtitles()

  parser.on('tracks', handlers.tracks)
  parser.on('subtitle', handlers.subtitle)

  return parser
}

export default function (event, stream, isTorrent = false) {
  const parser = generateParser(generateHandlers(event))
  const throttle = new Throttle({ rate: (isTorrent ? 1 : 50) * 1000 * 10240 })

  stream.pipe(throttle).pipe(parser)

  logger.info('Parsing subtitles for video')
}
