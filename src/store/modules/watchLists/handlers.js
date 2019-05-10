import { log } from '@/store/utils'

function checkInfo ({ rootState, dispatch }, data) {
  if (!rootState.isConnected) return setTimeout(() => checkInfo({ rootState, dispatch }, data), 30 * 1000)

  // Checking if we should check information for some of the entries.
  // We ask information for at least one of 3 reasons:
  // 1. If there is no nbEp in the object
  // 2. If the last update was more that 2 weeks ago
  // 3. If there is no thumbnail
  const twoWeeksDiff = 2 * 7 * 24 * 60 * 60 * 1000
  const now = (new Date()).getTime()

  const toCheck = Object.keys(data).reduce((acc, listName) => {
    const list = data[listName]

    list.forEach((entry) => {
      const shouldCheck = [
        !entry.hasOwnProperty('nbEp') || entry.nbEp === '??',
        !(now - entry._timestamp > twoWeeksDiff),
        !entry.img
      ].some(Boolean)

      shouldCheck && acc.push(entry)
    })

    return acc
  }, [])

  dispatch('info', toCheck)
}

export const get = {
  success ({ rootState, commit, dispatch }, data) {
    log('Loaded watch lists')
    commit('set', data)

    checkInfo({ rootState, dispatch }, data)
  },
  error (msg) {
    log('An error occurred while retrieving the watch lists.', msg)
  }
}

export const update = {
  success ({ rootState, commit, dispatch }, data) {
    log('Successfully updated local information.')
    commit('set', data)

    checkInfo({ rootState, dispatch }, data)
  },
  error (msg) {
    log(`An error occurred while updating the watch lists.`, msg)
  }
}

export const info = {
  success (commit, data) {
    log('Successfully loaded list information.')
    commit('set', data)
  },
  error (msg) {
    log('An error occurred while retrieving the watch lists.', msg)
  }
}
