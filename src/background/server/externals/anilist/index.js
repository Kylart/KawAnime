import season from './season'
import watchLists from './watchLists'
import search from './search'
import * as auth from './auth'

export default {
  season,
  watchLists,
  ...search,
  auth
}
