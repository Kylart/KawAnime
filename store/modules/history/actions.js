import {axios, log} from '../../utils'

export default {
  append ({}, data) {  // eslint-disable-line
    axios.post('append', JSON.stringify(data)).then(() => {
      log(`Successfully appended to history.`)
    }).catch(err => {
      log('An error occurred while appending to history...', err)
    })
  },
  async get ({commit}) {
    const {data, status} = await axios.get('getHistory')

    if (status !== 200) { log(`An error occurred while gathering the history.`) }

    commit('set', data)
  },
  async remove ({dispatch}, data) {
    await axios.post('removeFromHistory', JSON.stringify(data))

    dispatch('get')
  }
}
