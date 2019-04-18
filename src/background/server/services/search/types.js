import { mal, kitsu, anilist } from '../../externals'

export default {
  'url': {
    mal: mal.fromUrl
  },
  'name': {
    mal: mal.fromName,
    kitsu: kitsu.fromName
  },
  'term': {
    mal: mal.searchTerm,
    kitsu: kitsu.searchTerm,
    anilist: anilist.searchTerm
  }
}
