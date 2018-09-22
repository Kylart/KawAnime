import {fansubs} from 'store/modules/lists.js'
import {moment} from 'store/utils.js'

export default {
  current: null,
  releases: {},
  autoRefresh: true,
  updateTime: moment(),
  isRefreshing: true,
  params: {
    quality: '',
    fansub: '',
    feed: 'si',
    term: ''
  },
  fansubs
}
