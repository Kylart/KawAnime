import sanitizeHtml from 'sanitize-html'

function capitalize (word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function beautify (str) {
  return str
    .split('_')
    .map(capitalize)
    .join(' ')
}

function getFormat (format) {
  return format
    ? format.split('_').slice(-1)[0].toUpperCase()
    : 'N/A'
}

function generateSentence (data) {
  const { status, source, season, startDate, episodes, duration } = data

  const _source = source === 'ORIGINAL'
    ? 'is an Original'
    : source
      ? `adapted from the ${beautify(source)}`
      : 'adapted from unknown material'

  const nbEpisodes = episodes
    ? `It's been announced with ${episodes} episodes`
    : 'Yet an unknown number of episodes'

  const _duration = duration
    ? `of ${duration} minutes`
    : 'of an unknown duration.'

  const _status = status ? capitalize(status) : ''
  const _season = season && startDate
    ? `, released in ${capitalize(season)} ${startDate.year}`
    : ''

  return `${_status}${_season} and ${_source}. ${nbEpisodes} ${_duration}`
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
    type: getFormat(data.format),
    synopsis: data.description && data.description.replace(/<br>/g, ''),
    score: data.averageScore,
    scoreOutOf: 100,
    nbVotes: data.stats.scoreDistribution
      ? data.stats.scoreDistribution.reduce((acc, { amount }) => (acc + amount), 0) + ' votes'
      : '',
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
        fromType: entry.source ? beautify(entry.source) : '',
        genres: entry.genres,
        synopsis: entry.description ? sanitizeHtml(entry.description, { allowedTags: ['b', 'i', 'em', 'strong', 'a'] }) : 'No synopsis yet.',
        score: entry.averageScore,
        scoreOutOf: 100,
        picture: entry.coverImage.extraLarge || entry.coverImage.large,
        producers: entry.studios.nodes.map(({ name }) => name)
      }))

      return acc
    },
    {}
  )
}

export function formatList (data) {
  return data.MediaListCollection.lists
    .reduce((acc, list) => [...acc, ...list.entries], [])
    .map((entry) => ({
      ...entry,
      id: entry.media.id,
      title: entry.media.title.userPreferred || entry.media.title.english || entry.media.title.romaji,
      score: entry.score || null,
      progress: entry.progress,
      note: entry.notes,
      status: capitalize(entry.status || ''),
      nbEp: entry.media.episodes,
      format: getFormat(entry.media.format),
      startedAt: entry.startedAt,
      completedAt: entry.completedAt,
      img: entry.media.coverImage.extraLarge || entry.media.coverImage.large
    }))
}
