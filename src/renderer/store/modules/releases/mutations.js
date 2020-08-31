import { moment, log } from '@/store/utils.js'

export default {
  set (state, data) {
    state.updateTime = moment()

    // We'll keep all the already gotten releases in memory
    // using params as keys if no term is present
    // 1. feed
    // 2. fansub
    // 3. quality
    const { params } = state

    // Only checking for existence
    if (!Object.prototype.hasOwnProperty.call(state.releases.data, params.feed)) {
      state.releases.data[params.feed] = {}
    }

    if (!Object.prototype.hasOwnProperty.call(state.releases.data[params.feed], params.fansub)) {
      state.releases.data[params.feed][params.fansub] = {}
    }

    if (!Object.prototype.hasOwnProperty.call(state.releases.data[params.feed][params.fansub], params.quality)) {
      state.releases.data[params.feed][params.fansub][params.quality] = []
    }

    // If there are some data already, we should only add what's
    // not in there already.
    const current = state.releases.data[params.feed][params.fansub][params.quality]
    let index = data.length

    for (let i = 0, l = data.length; i < l; ++i) {
      const { name: refName } = data[i]

      const hasElem = current.find(({ name }) => name === refName)

      if (hasElem) {
        index = i
        break
      }
    }

    if (!params.term) {
      state.releases.data[params.feed][params.fansub][params.quality] = [...data.slice(0, index), ...current]
    }

    // Actually updating the current releases so that it's reactive
    state.releases.current = state.params.term ? data : [...data.slice(0, index), ...current]

    log('Updated releases.')

    state.instanciate = true
  },
  setCurrent (state, data) {
    state.current = data
  },
  setParams (state, data) {
    state.params = data
  },
  refreshing (state, bool) {
    state.isRefreshing = bool
  }
}
