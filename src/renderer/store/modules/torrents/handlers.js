import { log } from '@/store/utils'

export const add = {
  success (magnet) {
    log('Successfully added torrent. ID:', magnet)
  },
  error (msg) {
    log('An error occurred while adding a torrent to cient.', msg)
  }
}

export const act = {
  success (magnet) {
    log('Successfully updated status for torrent. ID:', magnet)
  },
  error (msg) {
    log('An error occurred while acting on torrent.', msg)
  }
}

export const info = {
  success (commit, data) {
    if (data) {
      const { client, torrents } = data

      torrents ? commit('set', torrents) : commit('set', [])
      client && commit('setClient', client)
    }
  },
  error (msg) {
    log('An error occurred while updated client information.', msg)
  }
}
