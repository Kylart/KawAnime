import {axios, log} from '../../utils'

export default {
  async init ({commit, dispatch}) {
    try {
      const {data, status} = await axios.get('releaseNotes')

      if (status === 200) {
        commit('set', data)
        commit('show', true)
      } else {
        setTimeout(() => { dispatch('init') }, 300)
      }
    } catch (e) {
      log('Error while getting the release note...', e)
      setTimeout(() => { dispatch('init') }, 300)
    }
  }
}
