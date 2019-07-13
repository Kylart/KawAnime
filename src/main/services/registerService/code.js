import { eventsList } from 'vendor'
import { anilist } from '../../externals'

const events = eventsList.register.code

const providers = {
  anilist: anilist.auth.setup.codeUrl
}

function handler (event, service) {
  event.returnValue = providers[service]
}

export default {
  eventName: events.main,
  handler
}
