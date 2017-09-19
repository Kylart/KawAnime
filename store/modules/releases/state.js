import {fansubs} from '../lists.js'
import {moment} from '../../utils.js'

export default {
  releases: [],
  autoRefresh: true,
  updateTime: moment(),
  params: {
    quality: '',
    fansub: '',
    choice: 'si'
  },
  fansubs
}
