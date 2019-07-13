import { eventsList } from 'vendor'
import { anilist, kitsu } from '../../externals'

const events = eventsList.register.isAuthed

const providers = {
  kitsu: kitsu.auth.isAuthed,
  anilist: anilist.auth.isAuthed
}

async function handler (event, service) {
  try {
    if (!providers[service]) return

    const isConnected = await providers[service]()

    event.sender.send(events.success, { service, value: isConnected })
  } catch (e) {
    event.sender.send(events.error, { service, msg: e.message })
  }
}

export default {
  eventName: events.main,
  handler
}
