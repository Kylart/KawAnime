import {fansubs} from '../lists.js'
import {moment} from '../../utils.js'

export default {
  releases: [],
  autoRefresh: true,
  updateTime: moment(),
  notLoaded: false,
  params: {
    quality: '',
    fansub: '',
    choice: 'si'
  },
  fansubs
}
