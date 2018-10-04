import { axios, log, isRoot } from 'store/utils'

export default {
  save ({ state, commit }, data = null) {
    axios.post('saveConfig', JSON.stringify({
      config: data || state.config
    })).then((res) => {
      if (res.status === 200) {
        log(`Successfully updated config!`)
        commit('setInfoSnackbar', 'Config saved successfully.', isRoot)
      }
    }).catch((err) => {
      log(`An error occurred while saving config:`, err)
      commit(
        'setInfoSnackbar',
        'An error occurred while saving config. If the problem continues to occur, please restart KawAnime and try again.',
        isRoot
      )
    })
  },
  async changeDir ({ commit, dispatch }) {
    const { data } = await axios.get('openThis?type=dialog')

    if (data) {
      commit('setDir', data.path)
      commit('localFiles/empty', null, isRoot)
      commit('localFiles/setDir', data.path, isRoot)
      dispatch('localFiles/refresh', null, isRoot)
    }
  }
}
