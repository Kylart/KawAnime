import { eventsList } from '../../../../vendor'
import { Logger, https } from '../../utils'

const events = eventsList.analytics
const ANALYTICS_URL = 'https://kawanime.com/api/v1/analytics'

const logger = new Logger('Analytics')

async function send (event, { eventName, data }) {
  https.post(ANALYTICS_URL, {
    eventName,
    data
  })
    .catch(() => {
      // We ignore errors
      logger.error(`Could not send ${eventName} analytics event.`)
    })
}

export default {
  eventName: events.main,
  handler: send
}
