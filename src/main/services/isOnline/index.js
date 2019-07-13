import { get } from 'https'

import { eventsList } from 'vendor'

const events = eventsList.isOnline
const targets = [
  'myanimelist.net',
  'nyaa.si',
  'google.com'
]

function checkUrl (url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = ''

      res.on('data', (chunk) => (data += chunk))

      res.on('end', () => {
        resolve()
      })
    })
      .on('error', (err) => reject(err))
  })
}

async function check (event) {
  let failed = 0

  // We check for each url if at least one is reachable.
  // If and only if none is available, we send false.
  for (const target of targets) {
    try {
      await checkUrl(`https://${target}`)

      event.sender.send(events.success)
      break
    } catch (e) {
      ++failed

      if (failed === targets.length) event.sender.send(events.error)
    }
  }
}

export default {
  eventName: events.main,
  handler: check
}
