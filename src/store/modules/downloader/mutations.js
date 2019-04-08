export default {
  setModal (state, data) {
    state.modal = data
  },
  closeModal (state) {
    state.modal.show = false
  }
}
