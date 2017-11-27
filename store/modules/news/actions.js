import {axios, log} from '../../utils'

export default {
  async init ({commit, dispatch}) {
    console.log('[INIT] News')

    try {
      const {data, status} = await axios.get('news.json')

      if (status === 200) {
        commit('set', data)
      } else {
        log('A problem occurred while gathering the news.')
        setTimeout(() => { dispatch('init') }, 30 * 1000)
      }
    } catch (e) {
      log('A problem occurred while gathering the news.')
      setTimeout(() => { dispatch('init') }, 30 * 1000)
    }
  },
  async refresh ({commit, dispatch}) {
    log(`Refreshing News...`)

    commit('empty')

    const {data, status} = await axios.get('news.json')

    status === 200
      ? commit('set', data)
      : log('A problem occurred while gathering the news.') && setTimeout(() => { dispatch('refresh') }, 30 * 1000)
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
