import {axios, log} from 'store/utils'

export default {
  async init ({state, commit}) {
    console.log('[INIT] Local Files')

    const {data} = await axios.get(`local.json?dir=${state.dir}`)

    commit('set', data)
  },
  async refresh ({commit, state}) {
    log(`Refreshing Local files...`)

    commit('toggleRefreshing')

    const {data} = await axios.get(`local.json?dir=${state.dir}`)

    commit('toggleRefreshing')
    commit('set', data)
  },
  async reset ({state, commit, dispatch}) {
    log(`Resetting local information...`)

    commit('toggleResetting')

    axios.get(`resetLocal?dir=${state.dir}`).then(() => {
      dispatch('refresh')
      log(`Reset completed.`)
    }).catch((err) => {
      log('An error occurred while resetting.\n' + err)
    }).then(() => { commit('toggleResetting') })
  },
  async changePath ({commit, dispatch}) {
    const {data} = await axios.get('openThis?type=dialog')

    if (data) {
      commit('empty')
      commit('setDir', data.path)
      dispatch('refresh')
    }
  }
}
