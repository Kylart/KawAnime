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

export function formatInfo (data) {
  return {
    title: {
      en: data.title,
      jp: data.japaneseTitle
    },
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
