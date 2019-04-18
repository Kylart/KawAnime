export function formatEps (data) {

}

export function formatInfo (rawData) {

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
