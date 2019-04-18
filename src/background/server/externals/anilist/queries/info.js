export default function (name) {
  return `
  {
    Media(search: "${name}") {
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
      description
      episodes
      duration
      genres
      studios {
        nodes {
          name
        }
      }
      isAdult
      staff {
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
}
