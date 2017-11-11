import {_} from '../../utils.js'

export default {
  lists (state) {
    const result = []
    const priorities = {
      'Low': 1,
      'Medium': 2,
      'High': 3
    }

    const status = {
      1: 'Watching',
      2: 'Completed',
      3: 'On Hold',
      4: 'Dropped',
      6: 'Plan to watch'
    }

    _.each(state.watchLists, (entry) => {
      const dec = (entry.num_watched_episodes / entry.anime_num_episodes) || 1
      result.push({
        score: entry.score || 'N/A',
        progress: (entry.num_watched_episodes || '??') + ' / ' + (entry.anime_num_episodes || '??'),
        progressDec: (dec === 1 ? entry.num_watched_episodes : dec),
        title: entry.anime_title,
        priorityString: entry.priority_string,
        priorityNum: priorities[entry.priority_string],
        type: entry.anime_media_type_string,
        image: entry.anime_image_path,
        url: 'https://myanimelist.net' + entry.anime_url,
        id: entry.anime_id,
        status: status[entry.status],
        statusNum: entry.status
      })
    })

    return _.orderBy(result, ['title', 'score'], ['asc', 'desc'])
  }
}
