const queryCore = `
      title {
        english
        romaji
        userPreferred
        native
      }
      externalLinks {
        url
        site
      }
      coverImage {
        extraLarge
        large
      }
      status
      averageScore
      source
      description(asHtml: false)
      episodes
      genres
      studios {
        nodes {
          name
        }
      }
    }
  }
`

const types = {
  TV: '[ TV, TV_SHORT ]',
  Movies: '[ MOVIE ]',
  Specials: '[ SPECIAL ]',
  OVAs: '[ OVA ]',
  ONAs: '[ ONA ]'
}

const queryHeader = 'query ($year: Int, $season: MediaSeason) {'

function makeFormatFilter (type) {
  return `format_in: ${types[type]}`
}

const mainQuery = Object.keys(types).reduce((acc, type) => {
  const formatFilter = makeFormatFilter(type)
  const header = `${type}: Page(perPage: 10000) {`
  const filter = `media(season: $season, seasonYear: $year ${formatFilter}, isAdult: false) {`

  acc += [header, filter, queryCore].join('\n')

  return acc
}, '')

export default `${queryHeader} ${mainQuery} }`
