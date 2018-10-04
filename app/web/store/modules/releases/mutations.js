import { moment } from 'store/utils.js'

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
    if (!state.releases.hasOwnProperty(params.feed)) {
      state.releases[params.feed] = {}
    }

    if (!state.releases[params.feed].hasOwnProperty(params.fansub)) {
      state.releases[params.feed][params.fansub] = {}
    }

    if (!state.releases[params.feed][params.fansub].hasOwnProperty(params.quality)) {
      state.releases[params.feed][params.fansub][params.quality] = []
    }

    // If there are some data already, we should only add what's
    // not in there already.
    const current = state.releases[params.feed][params.fansub][params.quality]
    let index = data.length

    for (let i = 0, l = data.length; i < l; ++i) {
      const elem = JSON.stringify(data[i])

      const hasElem = current.filter((e) => JSON.stringify(e) === elem).length

      if (hasElem) {
        index = i
        return
      }
    }

    state.releases[params.feed][params.fansub][params.quality] = state.params.term
      ? data
      : [...data.slice(0, index), ...current]

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
