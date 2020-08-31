<template lang="pug">
  v-dialog(v-model='show', persistent, absolute, width='700', @keydown.esc='close()')
    v-card.pa-2
      v-card-title.grey--text.text-uppercase
        v-row(justify='center', align='center')
          div Setup list entry

      v-divider

      v-card-text
        v-container
          v-row(align='center', justify='space-around')
            v-col
              v-text-field(
                v-model='entry.name',
                ref='name',
                label='Name',
                placeholder='Sakura Trick',
                hide-details,
                clearable
              )

            v-col
              v-text-field(
                v-model='entry.progress',
                type='number',
                min='0',
                :max='`${entry.nbEp}`|| null',
                label='Watched episodes',
                clearable,
                hide-details
              )

            v-col
              v-select(
                v-model='entry.list',
                :items='availableLists',
                label='Category',
                item-text='name',
                item-value='list',
                hide-details
              )

        v-container
          v-row(align='center', justify='space-around')
            v-col
              v-combobox(
                multiple, small-chips, deletable-chips,
                label='Tags',
                v-model='entry.tags',
                :items='availableTags',
                hide-details
              )

            v-col
              v-text-field(
                v-model='entry.score',
                type='number',
                min='0', :max='`${scoreOutOf}`',
                label='How good is it?',
                clearable,
                hide-details,
                :suffix='`/ ${scoreOutOf}`'
              )

        v-container
          v-row(justify='center', align='center')
            v-textarea(
              v-model='entry.note',
              label='Comment',
              outlined
            )

      v-divider

      v-card-actions
        v-spacer
        v-btn(@click='submit()') submit
        v-btn.red.lighten-1(@click='cancel()') cancel
</template>

<script>
export default {
  data: () => ({
    scoreOutOf: 10,
    entry: {
      name: '',
      progress: 0,
      score: null,
      list: 'watching',
      tags: [],
      note: ''
    }
  }),

  computed: {
    storeEntry: {
      get () {
        return this.$store.state.watchLists.form.entry
      },
      set () {}
    },
    show: {
      get () {
        return this.$store.state.watchLists.form.show
      },
      set (bool) {
        this.$store.commit('watchLists/toggleForm', bool)
      }
    },
    availableLists: {
      get () {
        return this.$store.state.watchLists.listNames
      },
      set () {}
    },
    availableTags () {
      const malList = this.$store.state.services.mal.list

      if (!malList) return []

      return malList
        .reduce((acc, { tags }) => [...acc, ...tags.split(', ')], [])
        .filter(({ tag }, index, arr) => !arr.includes(tag))
        .filter(Boolean)
        .sort()
    }
  },

  methods: {
    close () {
      this.show = false
    },
    resetEntry () {
      this.entry = {
        name: '',
        progress: 0,
        score: null,
        list: 'watching',
        tags: [],
        note: ''
      }
    },
    submit () {
      if (this.entry.name.length < 2) {
        this.$store.commit('setInfoSnackbar', 'The name needs to be at least 1 character long.')
        return
      }

      this.$store.dispatch('watchLists/add', this.entry)

      this.cancel()
    },
    cancel () {
      this.resetEntry()
      this.close()
    }
  },

  watch: {
    show (bool) {
      if (bool) {
        if (this.storeEntry) this.entry = this.storeEntry

        this.$nextTick(() => {
          this.$refs.name.focus()
        })
      } else {
        this.$store.commit('watchLists/resetEntry')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .entry-title, .entry-title-generic
    font-size 18px
    letter-spacing 1px
    font-weight 300

  .entry-title
    font-style italic
    font-weight 400

  .submit
    display flex
    justify-content space-between
</style>
