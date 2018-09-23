export default {
  getReleases (state) {
    const { fansub, quality, feed } = state.params

    return state.releases[feed][fansub][quality]
  }
}
