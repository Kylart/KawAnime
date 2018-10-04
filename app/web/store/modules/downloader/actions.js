import { axios, log } from 'store/utils'

export default {
  async download ({ state, commit, rootState }, config) {
    try {
      const { data, status } = await axios.post('download', config)

      if (status !== 200) {
        log('An error occurred while downloading the following request.')
        commit('setInfoSnackbar', `An error occurred while trying to download ${config.name}.`)
        return
      }

      if (!data.magnets.length) {
        commit('setInfoSnackbar', `Could not find any torrent for ${config.name}.`)
        return
      }

      commit('setModal', {
        show: true,
        title: config.name,
        magnets: data.magnets
      })
    } catch (e) {
      log('API does not seem to be reponding.', e)
    }
  }
}
