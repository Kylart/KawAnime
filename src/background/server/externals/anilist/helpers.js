function capitalize (word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function generateSentence (data) {
  const { status, season, startDate, episodes, duration } = data

  const nbEpisodes = episodes
    ? 'Yet an unknown number of episodes'
    : `It's been announced with ${episodes} episodes`

  const _duration = duration
    ? 'of an unknown duration.'
    : `of ${duration} minutes`

  const _status = status ? capitalize(status) : ''
  const _season = season && startDate
    ? `, released in ${capitalize(season)} ${startDate.year}`
    : ''

  return `${_status} ${_season}. ${nbEpisodes} ${_duration}`
}

function getChars (chars) {
  try {
    return chars.map((char) => ({
      name: [char.node.name.first, char.node.name.last].join(' '),
      img: char.node.image.large,
      link: char.node.siteUrl,
      seiyuu: {
        name: [char.voiceActors[0].name.first, char.voiceActors[0].name.last].join(' '),
        img: char.voiceActors[0].image.large,
        link: char.voiceActors[0].siteUrl
      }
    }))
  } catch (e) {
    return []
  }
}

function getStaff (staff) {
  return staff.map(({ node, role }) => {
    if (!node) return {}

    return {
      name: [node.name.first, node.name.last].join(' '),
      link: node.siteUrl,
      img: node.image.large,
      role
    }
  })
}

export function formatInfo (rawData) {
  const data = rawData.Media

  return {
    title: {
      en: data.title.userPreferred || data.title.english || data.title.romaji,
      jp: data.title.native
    },
    id: data.id,
    malId: data.idMal,
    img: data.coverImage.extraLarge || data.coverImage.large,
    type: data.format,
    synopsis: data.description.replace(/<br>/g, ''),
    score: data.averageScore,
    scoreOutOf: 100,
    nbVotes: data.stats.scoreDistribution.reduce((acc, { amount }) => (acc + amount), 0),
    nbEpisodes: data.episodes,
    sentence: generateSentence(data),
    rating: data.isAdult ? 'NSFW' : 'SFW',
    genres: data.genres,
    studios: data.studios.nodes
      ? 'By ' + data.studios.nodes.map(({ name }) => name).join(', ')
      : 'Unknown studios',
    characters: getChars(data.characters.edges),
    staff: getStaff(data.staff.edges)
  }
}

export function formatSearch (data) {
  return data.Page.media
    ? data.Page.media.map((entry) => ({
      id: entry.id,
      malId: entry.idMal,
      name: entry.title.romaji || entry.title.english,
      img: entry.coverImage.extraLarge || entry.coverImage.large,
      next: {
        id: entry.id,
        malId: entry.idMal,
        name: entry.title.romaji || entry.title.english
      }
    }))
    : []
}

export function formatSeason (data) {
  return Object.keys(data).reduce(
    (acc, key) => {
      acc[key] = data[key].media.map((entry) => ({
        title: entry.title.userPreferred || entry.title.english || entry.title.romaji,
        nbEp: entry.episodes || '?',
        fromType: entry.source ? capitalize(entry.source) : '',
        genres: entry.genres,
        synopsis: entry.description ? entry.description.replace(/<br>/g, '') : 'No synopsis yet.',
        score: entry.averageScore,
        picture: entry.coverImage.extraLarge || entry.coverImage.large,
        producers: entry.studios.nodes.map(({ name }) => name)
      }))

      return acc
    },
    {}
  )
}
