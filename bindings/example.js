const addon = require('./build/Release/kawabinds')

let intervalId
console.log(addon)
const client = new addon.torrent.Client()

console.log(
  client.addTorrent(
    '/Users/kylart/Downloads/blabla',
    'magnet:?xt=urn:btih:600f816632f326168b3160fabbdf282ef8e23ab8&dn=%5BHorribleSubs%5D%20Azur%20Lane%20-%2002%20%5B720p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce'
  )
)

setTimeout(() => {
  console.log('pausing')
  client.destroy()
  console.log('destroyed')
  const paused = client.pauseTorrent(client.hasTorrents() && client.getTorrents()[0].id)

  console.log(paused)

  if (paused) {
    console.log('paused gg')
    // clearInterval(intervalId)
  }
}, 2000)

// setTimeout(() => {
//   console.log('removing')
//   const resumed = client.removeTorrent(client.hasTorrents() && client.getTorrents()[0].id)

//   if (resumed) {
//     console.log('resumed gg')
//     // clearInterval(intervalId)
//   }
// }, 5000)

intervalId = setInterval(() => {
  const torrents = client.getTorrents()

  console.log('got info')
  // console.log(torrents)
  // console.log(client.getClientInfo())

  if (client.hasTorrents() && torrents[0].done) clearInterval(intervalId)
}, 1000)
