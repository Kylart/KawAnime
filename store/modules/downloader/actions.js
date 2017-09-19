import {axios, log, isRoot} from '../../utils'

export default {
  async download ({state, commit, rootState}, obj = {}) {
    const isDownloader = obj.isDownloader || true
    const name = obj.name || state.form.name
    const fromEp = state.form.fromEp !== ''
      ? state.form.fromEp
      : 0
    const untilEp = state.form.untilEp !== ''
      ? state.form.untilEp
      : 20000
    const quality = isDownloader ? state.form.quality : rootState.config.config.quality

    const magnets = rootState.config.config.magnets

    log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

    const infos = {
      name: name,
      quality: quality,
      fromEp: +fromEp,
      untilEp: +untilEp,
      fansub: rootState.config.config.fansub,
      choice: 'si'
    }

    const {data, status} = await axios.post('download', infos)

    if (status === 200) {
      log(`Request fulfilled!`)

      if (magnets === true) {
        const lastEp = fromEp !== '1' ? +fromEp + +data.length : data.length
        log(`User says he prefers having magnets hashes.`)
        commit('setModal', {
          show: true,
          title: `${name.replace('_', ' ')}\t ${fromEp} - ${lastEp}`,
          text: data
        })
      } else {
        log(`Opening torrents directly on preferred torrent client.`)

        data.forEach((link) => {
          window.open(link)
        })
      }
    } else if (status === 204) {
      log('nyaa.si is down, trying with nyaa.pantsu.cat')

      const {data, status} = await axios.post('download', {
        name: name,
        quality: quality,
        fromEp: fromEp,
        untilEp: untilEp,
        fansub: rootState.config.fansub,
        choice: 'pantsu'
      })

      if (status === 200) {
        log(`Request fulfilled!`)

        if (magnets === true) {
          const lastEp = fromEp !== '1' ? +fromEp + +data.length : data.length
          log(`User says he prefers having magnets hashes.`)
          commit('setModal', {
            show: true,
            title: `${name.replace('_', ' ')}\t ${fromEp} - ${lastEp}`,
            text: data
          })
        } else {
          log(`Opening torrents directly on preferred torrent client.`)

          data.forEach((link) => {
            window.open(link)
          })
        }
      } else {
        log('Unknown error occurred. nyaa.si and nyaa.pantsu.cat seem both down.')

        commit('setInfoSnackbar', 'Sorry. KawAnime was not able to get your torrents...', isRoot)
      }
    }

    state.form.loading = false
  }
}
