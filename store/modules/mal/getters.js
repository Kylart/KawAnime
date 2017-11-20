import {_} from '../../utils.js'

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
      const dec = (entry.nbWatchedEpisode / entry.nbEpisodes) || 1
      result.push({
        score: entry.score || 'N/A',
        progress: (entry.nbWatchedEpisode || '??') + ' / ' + (entry.nbEpisodes || '??'),
        progressDec: (dec === 1 ? entry.nbWatchedEpisode : dec),
        title: entry.title,
        type: types[entry.type],
        image: entry.picture,
        id: entry.id,
        status: status[entry.status],
        statusNum: entry.status,
        link: 'https://myanimelist.net/anime/' + entry.id + '/' + entry.title
      })
    })

    return _.orderBy(result, ['title', 'score'], ['asc', 'desc'])
  }
}
