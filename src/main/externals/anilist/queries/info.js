export default `
  query ($name: String) {
    Media(search: $name, type: ANIME) {
      title {
        english
        romaji
        userPreferred
        native
      }
      id
      idMal
      coverImage {
        extraLarge
        large
      }
      format
      status
      averageScore
      meanScore
      source
      season
      startDate {
        year
      }
      description (asHtml: false)
      episodes
      duration
      genres
      studios {
        nodes {
          name
        }
      }
      isAdult
      staff (perPage: 4) {
        edges {
          node {
            name {
              first
              last
            }
            siteUrl
            image {
              large
            }
          }
          role
        }
      }
      characters {
        edges {
          node {
            name {
              first
              last
            }
            siteUrl
            image {
              large
            }
          }
          voiceActors(language: JAPANESE) {
            name {
              first
              last
              native
            }
            siteUrl
            image {
              large
            }
          }
        }
      }
      stats {
        scoreDistribution {
          amount
        }
      }
    }
  }
`
