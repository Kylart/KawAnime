import {log} from '../../utils'

export default {
  set (state, data) {
    state.lists = data
    log('Updated watch lists.')
  },
  updateList (state, data) {
    const {listName, entry} = data
    state.lists[listName].push(entry)
    state.lists[listName].sort()
  },
  removeFromList (state, data) {
    const listName = data.listName
    const index = state.lists[listName].indexOf(data.entry)

    state.lists[listName].splice(index, 1)
  }
}
