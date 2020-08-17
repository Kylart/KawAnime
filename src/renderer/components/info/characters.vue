<template lang="pug">
  v-container(fluid)
    v-card(flat)
      v-card-text.pa-0.characters(
        v-if='characters.length'
      )
        v-row.characters-container(dense, justify='center')
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
    show: false
  }),

  computed: {
    characters () {
      return this.info.characters
    }
  }
}
</script>
