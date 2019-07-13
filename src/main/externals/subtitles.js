import MatroskaSubtitles from 'matroska-subtitles'
import { eventsList } from 'vendor'

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

export default function (event, stream) {
  const parser = generateParser(generateHandlers(event))

  stream.pipe(parser)
}
