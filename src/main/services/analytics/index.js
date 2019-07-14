import { readFileSync } from 'fs'

import { eventsList, config } from 'vendor'
import { Logger, https } from '../../utils'
import { localFiles } from '../../externals'

const events = eventsList.analytics
const userToken = readFileSync(localFiles.getPath('_token'), 'utf-8')
const { secret: secretKey, url: ANALYTICS_URL, version: VERSION } = config.kawanime

const logger = new Logger('Analytics')

async function send (event, { eventName, data }) {
  https.post(`${ANALYTICS_URL}/analytics`, {
    eventName,
    data,
    userToken,
    version: VERSION
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
