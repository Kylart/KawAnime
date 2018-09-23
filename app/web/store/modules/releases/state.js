import { fansubs, qualities } from 'store/modules/lists.js'
import { moment } from 'store/utils.js'

export default {
  instanciate: false,
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
  qualities,
  fansubs
}
