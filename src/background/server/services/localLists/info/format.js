export default function (data) {
  const now = (new Date()).getTime()

  return Object.keys(data).reduce((acc, key) => {
    const info = data[key]

    if (!info) return

    acc[key] = {
      _timestamp: now,
      id: { mal: info.idMal, anilist: info.id },
      title: info.title.userPreferred || info.title.romaji || info.title.english,
      nbEp: info.episodes || '??',
      img: info.coverImage.extraLarge || info.coverImage.large,
      bannerImg: info.bannerImage,
      format: info.format || 'Unknown',
      status: info.status || 'Unknown',
      season: info.season && info.startDate.year
        ? `${info.season} ${info.startDate.year}`
        : 'Unknown',
      duration: info.duration || 'Unknown',
      genres: info.genres,
      isAdult: info.isAdult
    }

    return acc
  }, {})
}
