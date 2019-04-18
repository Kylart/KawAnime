export default function (term) {
  return `
  {
    Page(perPage: 10) {
      media (search: "${term}") {
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
}
