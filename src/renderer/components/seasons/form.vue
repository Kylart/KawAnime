<template lang="pug">
  v-container(grid-list-md)
    v-layout(justify-space-around, align-center)
      v-flex(xs12, sm3, offset-sm1)
        v-select(
          label='Season',
          :items='seasons',
          v-model='season',
          item-text='name',
          item-value='value'
        )
      v-flex(xs12, sm3)
        v-text-field(
          label='Year'
          type='number',
          v-model='year',
          min='1917',
          :max='(new Date()).getFullYear() + 1'
        )
      v-flex(xs12, sm2)
        v-btn(block, @click='refresh') Refresh
</template>

<script>
export default {
  name: 'Form',

  data: () => ({
    seasons: [
      { name: 'Winter', value: 'winter' },
      { name: 'Spring', value: 'spring' },
      { name: 'Summer', value: 'summer' },
      { name: 'Fall', value: 'fall' }
    ]
  }),

  computed: {
    season: {
      get () {
        return this.$store.state.seasons.season
      },
      set (val) {
        this.$store.commit('seasons/setSeason', val)
      }
    },
    year: {
      get () {
        return this.$store.state.seasons.year
      },
      set (val) {
        this.$store.commit('seasons/setYear', val)
      }
    }
  },

  methods: {
    refresh () {
      this.$emit('refresh')
      this.$store.dispatch('seasons/refresh')
    }
  }
}
</script>
