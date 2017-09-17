import {axios, log, isRoot} from '../../utils'

export default {
  save ({state, commit}, data = null) {
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
  async changeDir ({commit, dispatch}) {
    const {data} = await axios.get('openThis?type=dialog')

    if (data) {
      commit('setDir', data.path)
      // TODO when local module ready
      commit('emptyLocals', null, isRoot)
      commit('setCurrentDir', data.path, isRoot)
      dispatch('refreshLocal', null, isRoot)
    }
  }
}
