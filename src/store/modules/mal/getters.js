import { _ } from '@/store/utils.js'

export default {
  lists (state) {
    const result = []
    const status = {
      1: 'Watching',
      2: 'Completed',
      3: 'On Hold',
      4: 'Dropped',
      6: 'Plan to watch'
    }

    _.each(state.watchLists, (entry) => {
      const dec = (+entry.numWatchedEpisodes / +entry.animeNumEpisodes) || 1

      const toAdd = {
        score: entry.score || 'N/A',
        progress: (entry.numWatchedEpisodes || '??') + ' / ' + (entry.animeNumEpisodes || '??'),
        progressDec: (dec === 1 ? entry.numWatchedEpisodes : dec),
        title: entry.animeTitle,
        type: entry.animeMediaTypeString,
        image: entry.animeImagePath,
        id: entry.animeId,
        status: status[entry.status],
        statusNum: entry.status,
        start: entry.startDateString === '0000-00-00' ? null : entry.startDateString,
        end: entry.endDateString === '0000-00-00' ? null : entry.endDateString,
        link: 'https://myanimelist.net' + entry.animeUrl,
        tags: entry.tags || 'No tags',
        nbCorrespondingTags: 0
      }

      if (state.tagsFilter.length) {
        if (toAdd.tags !== 'No tags') {
          _.each(state.tagsFilter, (tag) => {
            _.each(toAdd.tags.split(', '), (tag_) => {
              if (tag === tag_) {
                ++toAdd.nbCorrespondingTags
                result.push(toAdd)
              }
            })
          })
        }
      } else {
        result.push(toAdd)
      }
    })

    return _.uniqWith(
      _.orderBy(
        result,
        ['nbCorrespondingTags', 'title', 'score'],
        ['desc', 'asc', 'desc']
      ), _.isEqual)
  }
}
