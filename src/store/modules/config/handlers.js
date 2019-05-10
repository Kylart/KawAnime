import { log, isRoot } from '@/store/utils'

export const get = {
  success ({ commit, dispatch }, data) {
    commit('set', data.config)

    // Setting defaults
    dispatch('player/setUp', null, isRoot)
    commit('localFiles/setDir', data.config.localPath, isRoot)
    dispatch('localFiles/update', null, isRoot)
    commit('releases/setParams', {
      fansub: data.config.fansub,
      quality: data.config.quality,
      feed: data.config.feed
    }, isRoot)
  },
  error (commit, msg) {
    log('An error occurred while retrieving config:', msg)
    commit(
      'setInfoSnackbar',
      'An error occurred while retrieving config. If the problem continues to occur, please restart KawAnime and try again.',
      isRoot
    )
  }
}

export const update = {
  success (dispatch) {
    log('Successfully updated config!')
    dispatch('get')
  },
  error (commit, msg) {
    log('An error occurred while saving config:', msg)
    commit(
      'setInfoSnackbar',
      'An error occurred while saving config. If the problem continues to occur, please restart KawAnime and try again.',
      isRoot
    )
  }
}
