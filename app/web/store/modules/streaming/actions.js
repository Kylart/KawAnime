import { axios, log } from 'store/utils'

export default {
  async getNeighbours ({ state, commit }) {
    try {
      // Delivers the previous and the next file to be read by the player
      // First we need to get the currently read file path
      const { player: { link: { link } } } = state

      log('Setting neighbours for current file:', link)

      // We need to know if the link is a magnet link or if it's a local path
      const isMagnet = /^magnet/.test(link)

      // Cannot handle auto next magnet finding just yet
      if (isMagnet) {
        log('File is a magnet, returning.')
        commit('setNeighbours', null)
      }

      // Getting files from local and get the index of the current one
      const { data: files } = await axios.get('local/files', {
        params: {
          dir: link.split('/').slice(0, -1).join('/')
        }
      })

      // If there is only one file, we won't be playing it over and over again
      if (files.length === 1) {
        log('Only one file in the directory, no previous nor next to find.')
        commit('setNeighbours', null)
      }

      const index = files.findIndex((e) => e.path === link)

      // This actually shouldn't even be possible
      if (index === -1) {
        log('Yo, what the fuck?')
        commit('setNeighbours', null)
      }

      // If the file is the first one, there will be no previous
      // If the file is the last one, the next one will be the first file
      const previousIndex = index === 0 ? null : index
      const nextIndex = index + 1 >= files.length ? 0 : index + 1

      commit('setNeighbours', {
        previous: files[previousIndex],
        next: files[nextIndex]
      })
    } catch (e) {
      log('An error occurred while searching for file neighbours.', e)
      commit('setNeighbours', null)
    }
  }
}
