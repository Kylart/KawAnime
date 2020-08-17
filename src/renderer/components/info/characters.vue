<template lang="pug">
  v-container(fluid)
    v-card(flat)
      v-card-text.pa-0.characters(
        v-if='characters.length',
        @mouseenter='triggerDelay',
        @mouseleave='cancelDelay',
        :style='style',
        ref='characters'
      )
        v-row(dense, justify='center')
          template(v-for='character in characters')
            character(
              :key='`${character.name} -- ${character.link}`',
              :character='character'
            )

      v-card-text(v-else)
        h6 No character information :(
</template>

<script>
// Components
import Character from '@/components/info/character.vue'

// Mixins
import Info from '@/mixins/info/info.js'

export default {
  name: 'Characters',

  components: {
    Character
  },

  mixins: [
    // Brings `info` props
    Info
  ],

  data: () => ({
    show: false,
    timeout: null,
    delay: 750,
    style: {
      overflowY: 'hidden'
    }
  }),

  computed: {
    characters () {
      return this.info.characters
    }
  },

  methods: {
    triggerDelay () {
      if (!this.show) {
        this.timeout = setTimeout(this.expandChar, this.delay)
      }
    },
    cancelDelay () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    },
    expandChar () {
      this.show = true
      this.style.overflowY = 'auto'

      const elem = this.$refs.characters

      if (!elem) return

      const { clientHeight } = elem

      // Shitty animation ?
      let currentStep = 0
      const step = 5
      const necessarySteps = clientHeight / step

      const scrollDown = () => {
        elem.scrollTop += step
      }

      const timer = setInterval(() => {
        scrollDown()
        currentStep++

        if (currentStep === necessarySteps) {
          clearInterval(timer)
        }
      }, 1000 / 90)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .characters
    max-height 230px
    overflow-x hidden
    overflow-y auto
</style>
