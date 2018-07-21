import {axios, log, isRoot} from 'store/utils'

export default {
  async download ({state, commit, rootState}, obj = {}) {
    const isDownloader = obj.isDownloader || true
    const name = obj.name || state.form.name
    const fromEp = obj.fromEp || (state.form.fromEp !== ''
      ? state.form.fromEp
      : 0
    )
    const untilEp = obj.untilEp || (state.form.untilEp !== ''
      ? state.form.untilEp
      : 20000
    )
    const quality = obj.quality || (isDownloader ? state.form.quality : rootState.config.config.quality)

    log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

    const infos = {
      name,
      quality,
      fromEp: +fromEp,
      untilEp: +untilEp,
      fansub: obj.fansub || rootState.config.config.fansub,
      choice: 'si'
    }
    let failed = false

    commit('toggleLoading')

    const {data, status} = await axios.post('download', infos)

    if (status === 200) {
      log(`Request fulfilled!`)

      const epsLabel = {
        from: +fromEp || 'Begining',
        until: +untilEp === 20000 ? 'End' : untilEp
      }

      commit('setModal', {
        show: true,
        title: `${name.replace('_', ' ')}\t ${epsLabel.from} - ${epsLabel.until}`,
        magnets: data.magnets
      })
    } else if (status === 204) {
      log('nyaa.si is down, trying with nyaa.pantsu.cat')

      infos.choice = 'pantsu'
      const {data, status} = await axios.post('download', infos)

      if (status === 200 && data.magnets.length) {
        log(`Request fulfilled!`)

        const epsLabel = {
          from: +fromEp || 'Begining',
          until: +untilEp === 20000 ? 'End' : untilEp
        }

        commit('setModal', {
          show: true,
          title: `${name.replace('_', ' ')}\t ${epsLabel.from} - ${epsLabel.until}`,
          magnets: data.magnets
        })
      } else {
        failed = true
        log('Unknown error occurred. nyaa.si and nyaa.pantsu.cat seem both down.')

        commit('setInfoSnackbar', 'Sorry. KawAnime was not able to get those torrents...', isRoot)
      }
    } else {
      commit('setInfoSnackbar', 'Could not find anything, please try again.', isRoot)
    }

    commit(failed ? 'toggleLoading' : 'resetForm', quality)
  }
}
