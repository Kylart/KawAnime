import { axios, log } from 'store/utils'

export default {
  async init ({ rootState, commit, dispatch }) {
    if (!rootState.isConnected) {
      setTimeout(() => { dispatch('init') }, 60 * 1000)
      return
    }

    try {
      const { data, status } = await axios.get('releaseNotes')

      if (status === 200) {
        commit('set', data.logs)

        data.mustShow && commit('show', true)

        await axios.get('updateReleaseVersion')
      } else if (status === 204) {
        // If it is 204, it means GitHub API rate limit is exceeded
        // or that the version does not exist (dev).
        log('Will not be getting the release logs, seems we spammed GitHub.')
      } else {
        setTimeout(() => { dispatch('init') }, 30 * 1000)
      }
    } catch (e) {
      log('Error while getting the release note...', e)
      setTimeout(() => { dispatch('init') }, 300)
    }
  }
}
