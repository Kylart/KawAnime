<template lang="pug">
  v-dialog(v-model='show', persistent, max-width='650', @keydown.esc='hide()')
    v-card
      v-card-title.headline Add «{{ title }}» to
      v-card-text
        v-layout(row, wrap)
          template(v-for='i in 5')
            v-flex(v-if='i < 4', xs4)
              v-checkbox.option(
                color='orange',
                v-model='selected',
                :value='options[i - 1].value',
                :label='options[i - 1].label'
              )
            v-flex.checkbox-container(v-else, xs6)
              v-checkbox.option(
                color='orange',
                v-model='selected',
                :value='options[i - 1].value',
                :label='options[i - 1].label'
              )
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1(flat, @click='add()') Add
        v-btn.blue--text.darken-1(flat, @click='hide()') Close
</template>

<script>
export default {
  data () {
    return {
      selected: [],
      options: [{
        label: 'Watch list',
        value: 'watchList'
      }, {
        label: 'Watching',
        value: 'watching'
      }, {
        label: 'Seen',
        value: 'seen'
      }, {
        label: 'On Hold',
        value: 'onHold'
      }, {
        label: 'Dropped',
        value: 'dropped'
      }]
    }
  },
  methods: {
    hide () {
      this.$store.commit('setAddToChoice', false)
    },
    add () {
      this.selected.forEach((listName) => {
        this.$store.dispatch('watchLists/updateList', {
          listName,
          entry: this.title
        })
      })

      this.hide()
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.addToChoice.show
      },
      set (bool) {
        this.$store.commit('setAddToChoice', bool)
      }
    },
    title () {
      return this.$store.state.addToChoice.title
    }
  }
}
</script>

<style lang="stylus" scoped>
  .option
    width 60%
    margin-left 35%
</style>
