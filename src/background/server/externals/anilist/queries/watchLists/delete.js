export default `
  mutation (
    $mediaId: Int
  ) {
    DeleteMediaListEntry (
      id: $mediaId
    ) {
      deleted
    }
  }
`
