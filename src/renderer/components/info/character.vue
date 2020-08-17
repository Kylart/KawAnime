<template lang="pug">
  v-col(cols='4')
    v-card
      v-container.pa-0(fluid)
        v-row(dense)

          v-col(cols='3')
            .caption.text-right.link(@click='openLink(character.link)') {{ character.name }}

          v-col.d-flex.justify-center.align-center(cols='6')
            v-img(:src='sanitize(character.img)', contain, height='100', max-width='80', position='right top')
            v-img.ml-1(:src='sanitize(seiyuu.img)', contain, height='100', max-width='80', position='left top')

          v-col(cols='3')
            .caption.text-left.link(@click='openLink(seiyuu.link)') {{ seiyuu.name }}
</template>

<script>
import Sanitize from '@/mixins/info/sanitize.js'

export default {
  name: 'Character',

  mixins: [
    // Brings `sanitize` method
    Sanitize
  ],

  props: {
    character: {
      required: true,

      /**
       * @type {{
       *    img: String,
       *    link: String,
       *    name: String,
       *    seiyuu: {
       *      img: String,
       *      link: String,
       *      name: String
       *    }
       * }}
       */
      type: Object
    }
  },

  computed: {
    seiyuu () { return this.character.seiyuu }
  },

  methods: {
    openLink (link) {
      if (link) this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .link
    cursor pointer
</style>
