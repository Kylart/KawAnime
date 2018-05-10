import { qualities } from 'store/modules/lists'

export default {
  files (state) {
    const result = {}

    state.page.torrents.magnets.forEach(({ link, name }) => {
      const superKey = name.split(' ').slice(0, -3).join(' ') // Todo: Once nyanparser is done, make it be <fansub + name>
      const key = name.split(' ').slice(-2, -1)[0] // Todo: Once nyanparser is done, make it be <episodeNumber>

      if (typeof result[superKey] === 'undefined') result[superKey] = {}

      qualities.forEach(quality => {
        const qualityLabel = `[${quality}]`

        if (name.includes(quality)) {
          const index = name.indexOf(qualityLabel)

          if (key in result[superKey]) {
            result[superKey][key].quality.push(quality)
          } else {
            result[superKey][key] = {
              name,
              index,
              quality: [quality]
            }
          }
        }
      })
    })

    return result
  }
}
