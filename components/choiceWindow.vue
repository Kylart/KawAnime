<template lang="pug">
  v-dialog(v-model='show', persistent, width='650')
    v-card
      v-card-title.headline Add «{{ entry }}» to
      v-card-text
        v-layout(row, wrap)
          template(v-for='i in 5')
            v-flex(v-if='!options[i - 1].half', xs4)
              v-checkbox.option.primary--text(
                v-model='selected',
                :value='options[i - 1].value',
                :label='options[i - 1].label'
              )
            v-flex.checkbox-container(v-else, xs6)
              v-checkbox.option.primary--text(
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
    props: {
      entry: ''
    },
    data () {
      return {
        selected: [],
        options: [{
          label: 'Watch list',
          value: 'watchList',
          half: false
        }, {
          label: 'Watching',
          value: 'watching',
          half: false
        }, {
          label: 'Seen',
          value: 'seen',
          half: false
        }, {
          label: 'On Hold',
          value: 'onHold',
          half: true
        }, {
          label: 'Dropped',
          value: 'dropped',
          half: true
        }]
      }
    },
    methods: {
      hide () {
        this.$store.commit('setAddToChoice', false)
      },
      add () {
        this.selected.forEach((listName) => {
          const entry = this.entry
          this.$store.dispatch('updateList', {
            listName: listName,
            entry: entry
          })
        })

        this.hide()
      }
    },
    computed: {
      show () {
        return this.$store.state.addToChoice
      }
    }
  }
</script>

<style scoped>
  .option
  {
    width: 60%;
    margin-left: 35%;
  }
</style>
