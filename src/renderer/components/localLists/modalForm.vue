<template lang="pug">
  v-dialog(v-model='show', persistent, absolute, width='700', @keydown.esc='close()')
    v-card.pa-2
      v-card-title.grey--text.text-uppercase
        v-layout(justify-center, align-center)
          div Setup list entry

      v-divider

      v-card-text
        v-container(grid-list-md)
          v-layout(align-center, justify-space-around)
            v-flex
              v-text-field(
                v-model='entry.name',
                ref='name',
                label='Name',
                placeholder='Sakura Trick',
                hide-details,
                clearable
              )

            v-flex
              v-text-field(
                v-model='entry.progress',
                type='number',
                min='0',
                :max='`${entry.nbEp}`|| null',
                label='Watched episodes',
                clearable,
                hide-details
              )

            v-flex
              v-select(
                v-model='entry.list',
                :items='__llListNames',
                label='Category',
                item-text='name',
                item-value='list',
                hide-details
              )

        v-container(grid-list-md)
          v-layout(align-center, justify-space-around)
            v-flex
              v-combobox(
                multiple, small-chips, deletable-chips,
                label='Tags',
                v-model='entry.tags',
                :items='availableTags',
                hide-details
              )

            v-flex
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
          v-layout(justify-center, align-center)
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
import { localLists, global } from '@/store/helpers'

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
    // Brings __llListNames and __llLists
    ...localLists.state,

    show: {
      get () {
        return this.__llForm.show
      },
      set (bool) {
        this.__llToggleForm(bool)
      }
    },
    availableTags () {
      const malList = this.$store.state.services.mal.list

      if (!malList) return []

      return malList
        .reduce((acc, { tags }) => [ ...acc, ...tags.split(', ') ], [])
        .filter(({ tag }, index, arr) => !arr.includes(tag))
        .filter(Boolean)
        .sort()
    }
  },

  methods: {
    // Brings __SetLeftDrawer and __TellUser
    ...global.mutations,

    // Brings __llSet, __llToggleForm, __llSetEntry and __llResetEntry
    ...localLists.mutations,
    // Brings __llAdd, __llMove, __llDelete, __llGet and __llInfo
    ...localLists.actions,

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
      if (this.entry.name.length < 1) {
        this.__TellUser('The name needs to be at least 1 character long.')
        return
      }

      this.__llAdd(this.entry)

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
        if (this.__llForm.entry) this.entry = this.__llForm.entry

        this.$nextTick(() => {
          this.$refs.name.focus()
        })
      } else {
        this.__llResetEntry()
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
