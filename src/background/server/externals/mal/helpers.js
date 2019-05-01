const STATUS = {
  1: 'Watching',
  2: 'Completed',
  3: 'On Hold',
  4: 'Dropped',
  6: 'Plan to watch'
}

function formatCharacters (characters) {
  return characters.map((char) => ({
    link: char.link,
    name: char.name,
    img: char.picture,
    seiyuu: {
      link: char.seiyuu.link,
      name: char.seiyuu.name,
      img: char.seiyuu.picture
    }
  }))
}

function formatStaff (staff) {
  return staff.map((st) => ({
    link: st.link,
    name: st.name,
    role: st.role,
    img: st.picture
  }))
}

function getStudios (producers) {
  if (/None/.test(producers[0])) {
    return 'Unknown Producer'
  }

  return `By ${producers.join(' and ')}`
}

function generateSentence (data) {
  const { status, premiered, source, episodes, duration } = data

  const _source = source === 'Original'
    ? 'is an Original'
    : `adapted from the ${source}`

  const nbEpisodes = episodes === 'Unknown'
    ? 'yet an unknown number of episodes'
    : `It's been announced with ${episodes} episodes`

  const _duration = duration === 'Unknown'
    ? 'of an unknown duration.'
    : `of ${duration.replace('per ep.', '')}`

  return `${status}, it premiered on ${premiered} and ${_source}. ${nbEpisodes} ${_duration}`
}

function getPictureUrl (url) {
  const sizeRegex = /\/r\/\d*x\d*/
  const parts = url.split('.')

  const completeUrl = parts.slice(0, -1).join('.').replace(sizeRegex, '') + '.jpg'

  return completeUrl
}

export function formatInfo (data) {
  return {
    title: {
      en: data.title,
      jp: data.japaneseTitle
    },
    id: data.id,
    img: data.picture,
    type: data.type,
    synopsis: data.synopsis,
    score: data.score,
    scoreOutOf: 10,
    nbVotes: data.scoreStats.replace('scored by', ''),
    status: data.status,
    source: data.source,
    nbEpisodes: data.episodes,
    sentence: generateSentence(data),
    epDuration: data.duration,
    genres: data.genres,
    studios: getStudios(data.producers),
    rating: data.rating === 'None'
      ? 'For everyone'
      : data.rating,
    characters: formatCharacters(data.characters),
    staff: formatStaff(data.staff)
  }
}

export function formatSearch (data) {
  return data.map((entry) => ({
    img: getPictureUrl(entry.thumbnail),
    name: entry.title,
    next: {
      url: entry.url,
      name: entry.title
    }
  }))
}

export function formatList (data) {
  return data.map((entry) => ({
    ...entry,
    id: entry.animeId,
    title: entry.animeTitle,
    score: entry.score,
    progress: entry.numWatchedEpisodes,
    status: STATUS[entry.status],
    nbEp: entry.animeNumEpisodes,
    format: entry.animeMediaTypeString,
    tags: entry.tags,
    img: getPictureUrl(entry.animeImagePath)
  }))
}
