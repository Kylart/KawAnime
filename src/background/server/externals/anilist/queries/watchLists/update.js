export default `
  mutation (
    $mediaId: Int,
    $status: MediaListStatus,
    $score: Float,
    $scoreRaw: Int,
    $progress: Int,
    $repeat: Int,
    $priority: Int,
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
      scoreRaw: $scoreRaw
      progress: $progress,
      repeat: $repeat,
      priority: $priority,
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
