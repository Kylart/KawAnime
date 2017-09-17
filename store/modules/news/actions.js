import {axios, log} from '../../utils'

export default {
  async init ({state, commit, dispatch}) {
    console.log('[INIT] News')
    const {data, status} = await axios.get('news.json')

    if (status === 200) {
      commit('set', data)
    } else {
      log('A problem occurred while gathering the news.')
      dispatch('init')
    }
  },
  async refresh ({commit, dispatch}) {
    log(`Refreshing News...`)

    commit('empty')

    const {data, status} = await axios.get('news.json')

    status === 200
      ? commit('set', data)
      : log('A problem occurred while gathering the news.') && dispatch('refresh')
  },
  async openLink ({rootState}, link) {
    log(`Opening ${link}`)

    await axios.get(
      rootState.config.config.inside
        ? `openThis?type=insideLink&link=${link}`
        : `openThis?type=link&link=${link}`
    )
  }
}
