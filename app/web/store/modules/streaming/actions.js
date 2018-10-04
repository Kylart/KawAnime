import { axios, log, isRoot } from 'store/utils'

export default {
  async watch ({ state, commit, rootState }, obj = {}) {
    const { name } = obj

    log(`Received a request to watch ${name}. Transmitting...`)

    const infos = {
      name,
      fromEp: 0,
      untilEp: 20000,
      fansub: obj.fansub || rootState.config.config.fansub,
      choice: 'si'
    }

    const { data, status } = await axios.post('download', infos)

    if (status === 200) {
      log(`Request fulfilled!`)

      commit('setTorrents', {
        title: name.replace('_', ' '),
        magnets: data.magnets
      })
    } else if (status === 204) {
      log('nyaa.si is down, trying with nyaa.pantsu.cat')

      infos.choice = 'pantsu'
      const { data, status } = await axios.post('download', infos)

      if (status === 200 && data.magnets.length) {
        log(`Request fulfilled!`)

        commit('setTorrents', {
          title: name.replace('_', ' '),
          magnets: data.magnets
        })
      } else {
        log('Unknown error occurred. nyaa.si and nyaa.pantsu.cat seem both down.')

        commit('setInfoSnackbar', 'Sorry. KawAnime was not able to get those torrents...', isRoot)
      }
    } else {
      commit('setInfoSnackbar', 'Could not find anything, please try again.', isRoot)
    }
  }
}
