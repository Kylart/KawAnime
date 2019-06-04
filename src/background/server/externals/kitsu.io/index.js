import episodes from './episodes'
import watchLists from './watchLists'
import search from './search'
import * as auth from './auth'

export default {
  episodes,
  watchLists,
  ...search,
  auth
}
