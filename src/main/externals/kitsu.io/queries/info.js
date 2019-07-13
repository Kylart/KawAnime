export default `
  query ($id: [String!]) {
    anime(id: $id) {
      nodes {
        titles {
          localized
          canonical
        }
        id
        posterImage {
          original {
            url
          }
        }
        synopsis
        averageRating
        userCount
        episodeCount
        episodeLength
        season
        startDate
        endDate
        status
        ageRating
        ageRatingGuide
        staff(first: 4) {
          nodes {
            role
            person {
              image {
                original {
                  url
                }
              }
              names {
                canonical
                localized
              }
            }
          }
        }
        characters {
          nodes {
            voices(first: 1) {
              nodes {
                person {
                  image {
                    original {
                      url
                    }
                  }
                  names {
                    canonical
                    localized
                  }
                }
              }
            }
            character {
              image {
                original {
                  url
                }
              }
              names {
                canonical
                alternatives
                localized
              }
            }
          }
        }
      }
    }
  }
`
