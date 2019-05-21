export default `
  query ($username: String) {
    MediaListCollection(userName: $username, type: ANIME) {
      lists {
        entries {
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
