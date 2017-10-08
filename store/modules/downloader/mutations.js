export default {
  setForm (state, data) {
    state.form = data
  },
  resetForm (state) {
    state.form = {
      name: '',
      fromEp: '',
      untilEp: '',
      quality: '',
      loading: false
    }
  },
  setQuality (state, quality) {
    state.form.quality = quality
  },
  setModal (state, data) {
    state.modal = data
  },
  toggleLoading (state) {
    state.form.loading = !state.form.loading
  },
  closeModal (state) {
    state.modal.show = false
  }
}
