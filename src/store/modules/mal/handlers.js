import { log } from '@/store/utils'

export function success (commit, data) {
  commit('isLoading', false)

  if (!data) return

  commit('setWatchLists', data.map((obj) => {
    obj.id = +obj.id
    obj.score = +obj.score
    obj.nbEpisodes = +obj.nbEpisodes
    obj.nbWatchedEpisode = +obj.nbWatchedEpisode
    obj.status = +obj.status

    return obj
  }))

  log('MyAnimeList > Watch lists loaded.')
  commit('setCustomTags')
}

export function error (msg) {
  log('MyAnimeList > Could not load watch lists', msg)
}
