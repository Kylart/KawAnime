export default function (username) {
  return `
  {
    MediaListCollection (userName: "${username}", type: ANIME) {
      lists {
        entries {
          score
          progress
          status
          notes
          media {
            id
            coverImage {
              extraLarge
              large
            }
            title {
              userPreferred
              native
              english
              romaji
            }
            episodes
            format
          }
        }
      }
    }
  }
  `
}
