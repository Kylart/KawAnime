export default `
  mutation (
    $mediaId: Int,
    $status: MediaListStatus,
    $score: Float,
    $progress: Int,
    $repeat: Int,
    $private: Boolean,
    $notes: String,
    $hiddenFromStatusLists: Boolean,
    $startedAt: FuzzyDateInput,
    $completedAt: FuzzyDateInput
  ) {
    SaveMediaListEntry (
      mediaId: $mediaId
      status: $status
      score: $score
      progress: $progress,
      repeat: $repeat,
      private: $private,
      notes: $notes,
      hiddenFromStatusLists: $hiddenFromStatusLists,
      startedAt: $startedAt,
      completedAt: $completedAt
    ) {
      id
    }
  }
`
