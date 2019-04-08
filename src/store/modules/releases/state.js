import { moment } from '@/store/utils.js'

export default {
  instanciate: false,
  current: null,
  releases: {
    data: {},
    current: []
  },
  autoRefresh: true,
  updateTime: moment(),
  isRefreshing: true,
  params: {
    quality: '',
    fansub: '',
    feed: 'si',
    term: ''
  }
}
