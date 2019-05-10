export default function (data) {
  const now = (new Date()).getTime()

  return Object.keys(data).reduce((acc, key) => {
    const info = data[key]

    acc[key] = {
      _timestamp: now,
      id: { mal: info.idMal, anilist: info.id },
      title: info.title.userPreferred || info.title.romaji || info.title.english,
      nbEp: info.episodes || '??',
      img: info.coverImage.extraLarge || info.coverImage.large,
      bannerImg: info.bannerImage,
      format: info.format,
      status: info.status,
      season: `${info.season} ${info.startDate.year}`,
      duration: info.duration,
      genres: info.genres,
      isAdult: info.isAdult
    }

    return acc
  }, {})
}
