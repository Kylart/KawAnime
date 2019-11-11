const { torrent } = require('./build/Release/kawabinds.node')

const client = new torrent.Client()

const TORRENTS = [
  'magnet:?xt=urn:btih:50af27af300b44aec651add3eeb7135fd0c15bfa&dn=%5BHorribleSubs%5D%20Hoshiai%20no%20Sora%20-%2005%20%5B720p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce',
  'magnet:?xt=urn:btih:cac2f5ab4f78a4605c77075dd51720a079c07616&dn=%5BHorribleSubs%5D%20Babylon%20-%2006%20%5B720p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce'
]

const DIR = './blabla'

function logNames () {
  const torrents = client.getTorrents()

  torrents.forEach((torrent) => {
    const { id, name, isPaused } = torrent.info()
    console.log(`${id} --> ${name}: ${isPaused}`)
  })
}

client.addTorrent(DIR, TORRENTS[0])

setInterval(logNames, 1000)

setTimeout(() => {
  console.log('adding one')
  client.addTorrent(DIR, TORRENTS[1])
}, 2000)

setTimeout(() => {
  console.log('Pausing first')
  client.getTorrents()[0].pause()
}, 4000)

setTimeout(() => {
  console.log('Resuming first')
  client.getTorrents()[0].resume()
}, 6000)
