export default {
  methods: {
    order (qualities) {
      // We have to clone qualities as the reverse method changes the original input,
      // which would cause an endless reversing loop and throws warning.
      const copy = Array.from(qualities)
      return copy.sort((a, b) => b.replace('p', '') - a.replace('p', ''))
    }
  }
}
