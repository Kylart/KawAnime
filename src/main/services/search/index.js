import { eventsList } from 'vendor'
import types from './types'
import { Logger } from '../../utils'

const logger = new Logger('Search')

function sendReponse (isSync, response, event, eventName = '') {
  isSync
    ? (event.returnValue = response)
    : event.sender.send(eventName, response)
}

export default Object.keys(types).map((_type) => {
  const events = eventsList.search[_type]

  async function handler (event, { provider, toSearch, isSync, opts }) {
    this._type = _type
    this.events = events

    try {
      const category = types[this._type]

      if (!Object.keys(category).includes(provider)) throw new Error('Could not give any data for this provider.')

      logger.info(`Searching with a ${this._type} with provider ${provider}`)

      const info = await category[provider](toSearch, opts)

      sendReponse(isSync, { provider, name: toSearch.name || toSearch.url, info }, event, this.events.success)
    } catch (e) {
      logger.error(`An error occured with provider ${provider}`, e)
      sendReponse(isSync, { provider, name: toSearch, msg: e.message }, event, events.error)
    }
  }

  return {
    eventName: events.main,
    handler
  }
})
