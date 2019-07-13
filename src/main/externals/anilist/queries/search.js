export default `
  query ($term: String) {
    Page(perPage: 10) {
      media (search: $term) {
        id
        idMal
        title {
          english
          romaji
        }
        coverImage {
          extraLarge
          large
        }
      }
    }
  }
`
