import { dirname } from 'path'

import { ipcRenderer, log } from '@/store/utils'
import { eventsList } from 'vendor'

export default {
  play ({ commit, dispatch }, opts) {
    const { isTorrent = false } = opts

    // We don't need to do anything if it's not a torrent
    if (!isTorrent) {
      commit('setPlayer', { name: opts.name, path: opts.link, show: true, isTorrent })
      dispatch('getNeighbours')

      return
    }

    const event = eventsList.streaming.init

    ipcRenderer.once(event.success, (e, data) => {
      commit('setPlayer', { ...data, show: true, isTorrent })
      dispatch('getNeighbours')
    })

    ipcRenderer.send(event.main, opts)
  },
  getNeighbours ({ rootState, state, commit, rootGetters }) {
    try {
      // Delivers the previous and the next file to be read by the player
      // First we need to get the currently read file path
      const { player: { path, torrent, name } } = state
      const link = torrent || path

      log('Setting neighbours for current file:', link)

      // We need to know if the link is a magnet link or if it's a local path
      const isMagnet = /^magnet/.test(link)

      // If the user is playing a magnet, we'll follow the following strategy to find
      // what he's gonna watch next:
      //
      // 1. Check if we have all the episodes in the info state;
      // 2. Check the watching episodes in the feed and simply take the next one;
      // 3. (Later) Skip the already seen episodes.
      if (isMagnet) {
        const [title, ep] = name.split(' - ')

        log('Setting neighbours for magnet', name)

        if (!title && !ep) {
          commit('setNeighbours', null)
          return
        }

        const info = rootGetters['info/getEntryInfo'](title)
        let next
        let previous

        // Looking for neighbours in info state.
        if (info.episodesLinks) {
          log('We have episode links, trying to set neighbours with it.')

          const preferrredQuality = rootState.config.config.video.quality
          const magnets = info.episodesLinks.magnets

          const hasNext = magnets.filter(({ nb }) => nb === +ep + 1)
          const hasPrevious = magnets.filter(({ nb }) => nb === +ep - 1)

          if (hasNext.length) next = hasNext.find(({ quality }) => quality === preferrredQuality) || hasNext[0]
          if (hasPrevious.length) previous = hasPrevious.find(({ quality }) => quality === preferrredQuality) || hasPrevious[0]

          if (next && previous) {
            commit('setNeighbours', {
              previous: {
                link: previous.link,
                title,
                ep: +ep - 1
              },
              next: {
                link: next.link,
                title,
                ep: +ep + 1
              }
            })

            return
          }
        }

        // Searching for candidates in the feed entries that are in the user's
        // watching list.
        const currentEntries = rootState.releases.releases.current
        const watching = [
          ...rootState.watchLists.lists.watching.map(({ name }) => name),
          ...(rootState.services.mal.lists || []).map(({ title }) => title),
          ...(rootState.services.anilist.lists || []).map(({ title }) => title),
          ...(rootState.services.kitsu.lists || []).map(({ title }) => title)
        ]

        const candidates = currentEntries.filter(({ parsedName }) => watching.includes(parsedName.anime_title))

        if (!candidates.length) {
          log('No candidates, returning...')
          commit('setNeighbours', null)
          return
        }

        const currentIndex = candidates.findIndex(({ parsedName }) => parsedName.anime_title === title)

        next = currentIndex === -1
          ? candidates[0]
          : currentIndex === 0
            ? null
            : candidates[currentIndex - 1] || candidates[0]

        previous = currentIndex === -1
          ? candidates[0]
          : candidates[currentIndex + 1] || candidates[0]

        commit('setNeighbours', {
          previous: {
            link: previous.links.magnet,
            title: previous.parsedName.anime_title,
            ep: previous.parsedName.episode_number
          },
          next: next
            ? {
              link: next.links.magnet,
              title: next.parsedName.anime_title,
              ep: next.parsedName.episode_number
            }
            : null
        })

        return
      }

      // Getting files from local and get the index of the current one
      const { result: files } = ipcRenderer.sendSync(eventsList.local.get.main, {
        dir: dirname(link),
        isSync: true
      })

      // If there is only one file, we won't be playing it over and over again
      if (files.length === 1) {
        log('Only one file in the directory, no previous nor next to find.')
        commit('setNeighbours', null)
        return
      }

      const index = files.findIndex((e) => e.path === link)

      // This actually shouldn't even be possible
      if (index === -1) {
        log('Yo, what the fuck?')
        commit('setNeighbours', null)
        return
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
