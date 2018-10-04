import { _ } from 'store/utils.js'

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
    const types = {
      1: 'TV',
      2: 'OVA',
      3: 'Movie',
      4: 'Special',
      5: 'ONA'
    }

    _.each(state.watchLists, (entry) => {
      const dec = (+entry.nbWatchedEpisode / +entry.nbEpisodes) || 1

      const toAdd = {
        score: entry.score || 'N/A',
        progress: (entry.nbWatchedEpisode || '??') + ' / ' + (entry.nbEpisodes || '??'),
        progressDec: (dec === 1 ? entry.nbWatchedEpisode : dec),
        title: entry.title,
        type: types[entry.type],
        image: entry.picture,
        id: entry.id,
        status: status[entry.status],
        statusNum: entry.status,
        start: entry.myStartDate === '0000-00-00' ? null : entry.myStartDate,
        end: entry.myEndDate === '0000-00-00' ? null : entry.myEndDate,
        link: 'https://myanimelist.net/anime/' + entry.id + '/' + entry.title,
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
