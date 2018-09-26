<template lang="pug">
  v-layout(row wrap justify-center align-end).loader-container
    v-flex(xs12).flex-centered
      h3.loading-text.white--text 少々お待ち下さいね〜
    v-flex(xs12).flex-centered
      img(v-if="number === 1" src="~static/images/loading-gif1.gif" height="500")
      img(v-else-if="number === 2" src="~static/images/loading-gif2.gif" height="500")
</template>

<style lang="stylus" scoped>
  .loading-text
    padding 0
    margin 0
    font-family 'Hiragino Mincho Pro', 'MS PMincho', serif

  .loader-container
    min-height calc(100vh - (48px + 24px))

  .flex-centered
    display flex
    justify-content center
</style>

<script>
export default {
  data () {
    return {
      number: this.ran()
    }
  },
  methods: {
    ran () {
      return parseInt(Math.random() * 2 + 1)
    }
  },
  beforeMount () {
    this.number = this.ran()
  }
}
</script>
