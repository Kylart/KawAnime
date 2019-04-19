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

function makeFormatFilter (type) {
  return `format_in: ${types[type]}`
}

export default function (year, season) {
  const mainQuery = Object.keys(types).reduce((acc, type) => {
    const formatFilter = makeFormatFilter(type)
    const header = `${type}: Page(perPage: 10000) {`
    const filter = `media(season: ${season.toUpperCase()}, seasonYear: ${year} ${formatFilter}, isAdult: false) {`

    acc += [ header, filter, queryCore ].join('\n')

    return acc
  }, '')

  return `{ ${mainQuery} }`
}
