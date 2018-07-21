import {axios, log} from 'store/utils'

export default {
  async init ({rootState, commit, dispatch}) {
    console.log('[INIT] News')
    const delay = 2 * 60 * 1000

    if (!rootState.isConnected) {
      setTimeout(() => { dispatch('init') }, delay)
      return
    }

    try {
      const {data, status} = await axios.get('news.json')

      if (status === 200) {
        commit('set', data)
      } else {
        log('A problem occurred while gathering the news.')
        setTimeout(() => { dispatch('init') }, delay)
      }
    } catch (e) {
      log('A problem occurred while gathering the news.')
      setTimeout(() => { dispatch('init') }, delay)
    }
  },
  async refresh ({commit, dispatch}) {
    log(`Refreshing News...`)

    commit('empty')

    const {data, status} = await axios.get('news.json')

    status === 200
      ? commit('set', data)
      : log('A problem occurred while gathering the news.') && setTimeout(() => { dispatch('refresh') }, 1 * 60 * 1000)
  },
  async openLink ({rootState}, link) {
    log(`Opening ${link}.`)

    await axios.get('openThis', {
      params: {
        type: rootState.config.config.inside ? 'inside' : 'link',
        link
      }
    })
  }
}
