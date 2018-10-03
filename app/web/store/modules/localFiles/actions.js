import { axios, log } from 'store/utils'

export default {
  init ({ dispatch }) {
    console.log('[INIT] Local Files')
    dispatch('update')
  },
  async update ({ state, commit }) {
    const { data, status } = await axios.get('local/files', {
      params: {
        dir: state.dir
      }
    })

    if (status !== 200) {
      log('An error occurred while checking for the files')
      return
    }

    commit('set', data)
  },
  async reset (store, name) {
    const { status } = await axios.delete('local/resetInfo', {
      params: {
        name
      }
    })

    if (status === 200) {
      log(`Successfully erased ${name}'s information.`)
    } else {
      log(`An error occurred while erasing ${name}'s informaton.`)
    }
  }
}
