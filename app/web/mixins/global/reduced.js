export default {
  mounted () {
    this.content = document.querySelector('.v-content__wrap')
    this.content.addEventListener('scroll', this.handleScroll)
  },

  beforeDestroy () {
    this.content.removeEventListener('scroll', this.handleScroll)
  },

  data: () => ({
    content: null
  }),

  computed: {
    reduced () {
      return this.entries.slice(0, this.sup)
    }
  },

  methods: {
    handleScroll (e) {
      const { scrollTop, scrollHeight } = this.content

      const max = this.entries.length

      const donePercent = scrollTop / scrollHeight
      const sup = Math.round((donePercent * max) + this.initSup)

      if (sup > this.sup) this.sup = sup
    },
    resetSup () {
      this.sup = this.initSup
    }
  }
}
