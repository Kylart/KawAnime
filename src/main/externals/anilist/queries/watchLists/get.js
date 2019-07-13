export default `
  query ($username: String) {
    MediaListCollection(userName: $username, type: ANIME) {
      lists {
        entries {
          score
          progress
          status
          notes
          repeat
          private
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
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
