export default {
  form: {
    show: false,
    entry: null
  },
  lastUpdate: 0,
  lists: {
    watchList: [],
    watching: [],
    seen: [],
    onHold: [],
    dropped: []
  },
  listNames: [{
    name: 'Plan to watch',
    list: 'watchList',
    icon: 'watch_later'
  }, {
    name: 'Watching',
    list: 'watching',
    icon: 'tv'
  }, {
    name: 'Seen',
    list: 'seen',
    icon: 'done_all'
  }, {
    name: 'On hold',
    list: 'onHold',
    icon: 'av_timer'
  }, {
    name: 'Dropped',
    list: 'dropped',
    icon: 'visibility_off'
  }]
}
