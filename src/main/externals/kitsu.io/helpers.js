import { https, graphql } from '../../utils'
import * as queries from './queries'
import { GRAPHQL_ENDPOINT } from './utils'

function capitalize (word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function beautify (str) {
  return str
    .split('_')
    .map(capitalize)
    .join(' ')
}

function generateSentence (data) {
  const { status, startDate, endDate, episodeCount: episodes, episodeLength: duration } = data

  const nbEpisodes = episodes
    ? 'Yet an unknown number of episodes'
    : `It's been announced with ${episodes} episodes`

  const _duration = duration
    ? 'of an unknown duration.'
    : `of ${duration} minutes`

  const _status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  const _end = endDate ? `to ${endDate}` : ''

  return `${_status}, releases from ${startDate} ${_end}. ${nbEpisodes} ${_duration}`
}

async function getInfo (id) {
  try {
    const data = await graphql(GRAPHQL_ENDPOINT, queries.info, { id })

    return data
  } catch (e) {
    console.error('info error', e)
    throw e
  }
}

async function getGenres (url) {
  try {
    const genres = await https.get(url)

    return genres.data.map((genre) => genre.attributes.name)
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

    return studios.length ? `By ${studios.join(', ')}` : 'Unknwon studios'
  } catch (e) {
    return []
  }
}

function getCharacters (info) {
  return info.characters.nodes
    .map((char) => ({
      name: char.character.canonical || char.character.names.localized.en || char.character.names.localized.en_jp,
      img: char.character.image && char.character.image.original.url,
      seiyuu: char.voices.nodes[0]
        ? {
          name: char.voices.nodes[0].person.canonical || char.voices.nodes[0].person.names.localized.en || char.voices.nodes[0].person.names.localized.en,
          img: char.voices.nodes[0].person.image && char.voices.nodes[0].person.image.original.url
        }
        : null
    }))
}

function getStaff (info) {
  return info.staff.nodes
    .map(({ role, person }) => {
      return {
        name: person.names.localized.en || person.names.localized.en_jp,
        img: person.image && person.image.original.url,
        role
      }
    })
    .filter(Boolean)
}

export function formatEps (rawData) {
  return rawData.map(({ attributes }) => ({
    aired: attributes.airdate,
    epNumber: attributes.number,
    title: attributes.canonicalTitle || attributes.titles.en_us || attributes.titles.en_jp || attributes.titles.en,
    japaneseTitle: attributes.titles.ja_jp,
    img: attributes.thumbnail ? attributes.thumbnail.original : ''
  }))
}

export async function formatInfo (rawData) {
  const [{ data: { anime: { nodes: [info] } } }, studios, genres] = await Promise.all([
    getInfo(rawData[0].id),
    getProd(rawData[0].relationships.productions.links.related),
    getGenres(rawData[0].relationships.genres.links.related)
  ])

  return {
    title: {
      en: info.titles.canonical || info.titles.localized.en_jp || info.titles.localized.en,
      jp: info.titles.localized.ja_jp
    },
    id: info.id,
    img: info.posterImage.original.url,
    type: rawData[0].attributes.showType,
    synopsis: info.synopsis.en,
    score: info.averageRating,
    scoreOutOf: 100,
    nbVotes: info.userCount + ' votes',
    nbEpisodes: info.episodeCount,
    sentence: generateSentence(info),
    rating: [info.ageRating, info.ageRatingGuide].join(' - '),
    genres,
    studios,
    characters: getCharacters(info),
    staff: getStaff(info)
  }
}

export function formatSearch (data) {
  return data.map((entry) => ({
    img: entry.attributes.posterImage.original,
    name: entry.attributes.titles.en || entry.attributes.titles.en_jp,
    next: {
      name: entry.attributes.titles.en || entry.attributes.titles.en_jp
    }
  }))
}

export function formatList (data) {
  const entries = data.data
  const animes = data.included

  return entries.map(({ id, attributes: entry }, index) => {
    const anime = animes[index].attributes

    return {
      ...entry,
      ...anime,
      id,
      title: anime.titles.en_jp || anime.canonicalTitle || anime.titles.en || anime.titles.en_us,
      score: entry.ratingTwenty,
      progress: entry.progress || 0,
      note: entry.notes,
      status: beautify(entry.status),
      nbEp: anime.episodeCount,
      format: (anime.subtype || '').toUpperCase(),
      img: anime.posterImage.original || anime.posterImage.large || anime.posterImage.medium
    }
  })
}
