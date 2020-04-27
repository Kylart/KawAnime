<template lang="pug">
  v-row(justify='center', align='end').loader-container
    v-col(cols='12').d-flex.justify-center
      h3.loading-text.pa-0.ma-0.white--text 少々お待ち下さいね〜
    v-col(cols='12').d-flex.justify-center
      img(:src='image', height='500')
</template>

<script>
import firstGif from '@/assets/images/loading-gif1.gif'
import secondGif from '@/assets/images/loading-gif2.gif'

export default {
  data: () => ({
    index: parseInt(Math.random() * 2)
  }),

  computed: {
    image () {
      return [
        firstGif,
        secondGif
      ][this.index]
    }
  }
}
</script>

<style lang="stylus" scoped>
  .loading-text
    font-family 'Hiragino Mincho Pro', 'MS PMincho', serif

  .loader-container
    min-height calc(100vh - (48px + 24px))
</style>
