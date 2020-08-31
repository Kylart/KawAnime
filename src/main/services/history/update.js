import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { localFiles } from '../../externals'

const logger = new Logger('History (Update)')
const FILE_NAME = 'history.json'

const actions = ['append', 'remove']

function getCurrentFile () {
  return localFiles.getFile(FILE_NAME)
}

function update (data) {
  return localFiles.writeFile(data, FILE_NAME)
}

export default actions.map((action) => {
  const events = eventsList.history[action]

  const handler = (event, args) => {
    try {
      const historyFile = getCurrentFile()

      if (action === 'append') {
        // Date info
        const today = new Date()
        const day = today.toDateString()
        const time = today.toLocaleTimeString()

        // Preparing data to append to file
        const data = {
          time: time,
          type: args.type,
          text: args.text
        }

        // Checking if date already entered
        /* istanbul ignore next */
        if (!historyFile[day]) historyFile[day] = []

        // Appending data to file
        historyFile[day].unshift(data)
      } else {
        const { date, info } = args

        historyFile[date] = historyFile[date].filter((elem) => {
          return elem.time !== info.time
        })
      }

      update(historyFile)

      logger.info('Successfully updated history.')
      event.sender.send(events.success)
    } catch (e) {
      logger.error('Failed to update history', e)
      event.sender.send(events.error, e.message)
    }
  }

  return {
    eventName: events.main,
    handler
  }
})
