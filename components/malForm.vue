<template lang="pug">
  v-dialog(v-model='show', lazy, absolute, persistent, max-width='800', @keydown.esc='close()')
    v-card
      v-layout(row, wrap)
        v-flex(xs6, offset-xs2) Blabla
      v-expansion-panel(popout)
        v-expansion-panel-content(ripple)
          .entry-title(slot='header') Advanced options
          v-card Blabla
</template>

<script>
  export default {
    computed: {
      show: {
        get () {
          return this.$store.state.mal.form
        },
        set (bool) {
          this.$store.commit('mal/showForm', bool)
        }
      }
    },
    methods: {
      close () {
        this.$store.commit('mal/showForm', false)
      }
    }
  }
</script>
