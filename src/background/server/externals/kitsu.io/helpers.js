import { https } from '../../utils'

function generateSentence (data) {
  const { status, startDate, endDate, episodeCount: episodes, episodeLength: duration } = data

  const nbEpisodes = episodes === 'Unknown'
    ? 'Yet an unknown number of episodes'
    : `It's been announced with ${episodes} episodes`

  const _duration = duration
    ? 'of an unknown duration.'
    : `of ${duration} minutes`

  const _status = status.charAt(0).toUpperCase() + status.slice(1)
  const _end = endDate ? `to ${endDate}` : ''

  return `${_status}, releases from ${startDate} ${_end}. ${nbEpisodes} ${_duration}`
}

async function getGenres (url) {
  try {
    const genres = await https.get(url)

    return genres.data.map((genre) => genre.attributes.name)
  } catch (e) {
    return []
  }
}

async function getChars (url) {
  try {
    const { data } = await https.get(url)

    const charsInfo = await Promise.all(
      data.map(async ({ relationships }) => {
        const { data: charInfo } = await https.get(relationships.character.links.related)
        const { data: seiyuuInfo } = await https.get(
          relationships.voices.links.related
            .replace('media-characters', 'character-voices')
            .replace('voices', 'person')
        )

        return {
          img: charInfo.attributes.image.original,
          name: charInfo.attributes.names.en,
          link: `https://myanimelist.net/character/${charInfo.malId}`,
          seiyuu: {
            img: seiyuuInfo.attributes.image.original,
            name: seiyuuInfo.attributes.name,
            link: `https://myanimelist.net/people/${charInfo.malId}`
          }
        }
      })
    )

    return charsInfo
  } catch (e) {
    return []
  }
}

async function getStaff (url) {
  try {
    const { data } = await https.get(url)

    const staff = await Promise.all(
      data.map(async ({ relationships, attributes: { role } }) => {
        const { data: person } = await https.get(relationships.person.links.related)

        return {
          img: person.attributes.image.original,
          name: person.attributes.name,
          link: `https://myanimelist.net/people/${person.attributes.malId}`,
          role
        }
      })
    )

    return staff
  } catch (e) {
    return []
  }
}

async function getProd (url) {
  try {
    const { data } = await https.get(url)

    const studios = await Promise.all(
      data
        .filter(({ attributes }) => attributes.role === 'studio')
        .map(async ({ relationships }) => {
          const { data: studio } = await https.get(relationships.company.links.related)

          return studio.attributes.name
        })
    )

    return `By ${studios.join(', ')}`
  } catch (e) {
    return []
  }
}

export async function formatInfo (data) {
  const [ genres, characters, staff, studios ] = await Promise.all([
    getGenres(data.relationships.genres.links.related),
    getChars(data.relationships.characters.links.related),
    getStaff(data.relationships.staff.links.related),
    getProd(data.relationships.productions.links.related)
  ])

  return {
    title: {
      en: data.attributes.titles.en,
      jp: data.attributes.titles['jp_jp']
    },
    img: data.attributes.posterImage.original,
    type: data.attributes.showType,
    synopsis: data.attributes.synopsis,
    score: data.attributes.averageRating,
    scoreOutOf: 100,
    nbVotes: data.attributes.userCount + ' votes',
    nbEpisodes: data.attributes.episodeCount,
    sentence: generateSentence(data.attributes),
    rating: [data.attributes.ageRating, data.attributes.ageRatingGuide].join(' - '),
    genres,
    studios,
    characters,
    staff
  }
}
