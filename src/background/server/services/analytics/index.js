import { readFileSync } from 'fs'

import { eventsList } from '../../../../vendor'
import { Logger, https } from '../../utils'
import { localFiles } from '../../externals'

const events = eventsList.analytics
const secretKey = process.env.VUE_APP_KAWANIME_SECRET
const ANALYTICS_URL = 'https://api.kawanime.com/v1/analytics'
const userToken = readFileSync(localFiles.getPath('_token'))

const logger = new Logger('Analytics')

async function send (event, { eventName, data }) {
  https.post(ANALYTICS_URL, {
    eventName,
    data,
    userToken
  }, [], { Authorization: `Bearer ${secretKey}` })
    .catch(() => {
      // We ignore errors
      logger.error(`Could not send ${eventName} analytics event.`)
    })
}

export default {
  eventName: events.main,
  handler: send
}
