export default {
  emptyCreds (state, service) {
    state[service] = {
      username: '',
      password: ''
    }
  }
}
