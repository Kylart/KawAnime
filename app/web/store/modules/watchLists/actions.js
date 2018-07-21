import {axios, log, isRoot} from 'store/utils'

export default {
  async init ({commit}) {
    console.log('[INIT] Watch List')

    const {data} = await axios.get(`watchList.json?`)

    log(`Received watch lists.`)

    commit('set', data)
  },
  save ({state}) {
    axios.post('saveWatchList', JSON.stringify(state.lists))
  },
  updateList ({state, dispatch, commit}, data) {
    const lists = {
      watchList: 'Watch list',
      onHold: 'On Hold'
    }

    const {listName, entry} = data
    const logListName = lists[data.listName] || listName

    const isAlreadyThere = state.lists[listName].filter((elem) => {
      return elem.split(' ').join('').toLowerCase() === entry.split(' ').join('').toLowerCase()
    }).length

    if (!isAlreadyThere) {
      commit('updateList', data)

      log(`${listName} list updated.`)
      commit('setInfoSnackbar', `${entry} was added to your «${logListName}» list.`, isRoot)
    } else {
      // Displays error message
      commit('setInfoSnackbar', `${entry} is already in your «${logListName}» list.`, isRoot)
    }

    dispatch('save')
  },
  removeFromList ({dispatch, commit}, data) {
    commit('removeFromList', data)

    dispatch('save')
  }
}
