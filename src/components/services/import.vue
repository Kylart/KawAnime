<template lang="pug">
  v-dialog(
    v-model='show',
    width='65%',
    lazy
  )
    v-tooltip(top, lazy, slot='activator')
      v-btn(slot='activator', icon, large)
        v-icon(large) import_export
      span Transfer Lists

    v-card
      v-card-title.grey--text.text-uppercase
        v-spacer
        span Transfer Lists
        v-spacer

      v-divider

      v-card-text
        v-container(grid-list-md, pa-0)
          v-layout(column, justify-space-between, align-center)
            v-flex
              v-select(
                label='From',
                hint='Which list to export.',
                persistent-hint,
                :items='sources',
                v-model='source'
              )

            v-scale-transition(group)
              template(v-if='source')
                v-flex.text-xs-center(key='icon')
                  v-icon(large) keyboard_arrow_down

                v-flex(key='select')
                  v-select(
                    label='To',
                    hint='Where to import it.',
                    persistent-hint,
                    :items='targets',
                    v-model='target'
                  )

      v-divider

      v-fade-transition
        template(v-if='source && target')
          v-card-actions
            v-spacer

            template(v-if='confirm')
              .pr-2
                | You are about to transfer your #[b {{ sourceName }}] list
                | to #[b {{ targetName }}]. Are you sure?

              v-btn(@click='transfer') Yes!

              v-btn.blue--text(flat, @click='confirm = false') Nevermind!

            template(v-else)
              v-btn(@click='confirm = true') Transfer!

              v-btn.blue--text(flat, @click='close') Cancel
</template>

<script>
export default {
  name: 'Service-Import',

  data: () => ({
    confirm: false,
    show: false,
    source: null,
    target: null,
    sources: [
      { text: 'Local', value: 'local' },
      { text: 'MyAnimeList.net', value: 'mal' },
      { text: 'Anilist.co', value: 'anilist' },
      { text: 'Kitsu.io', value: 'kitsu' }
    ]
  }),

  computed: {
    targetName () {
      return this.targets.find(({ value }) => value === this.target).text
    },
    sourceName () {
      return this.sources.find(({ value }) => value === this.source).text
    },
    isSame () {
      return this.source === this.target
    },
    targets () {
      if (!this.source) return []

      return this.sources.filter(({ value }) => value !== this.source)
    }
  },

  methods: {
    close () {
      this.show = false
    },
    transfer () {
      // const { source, target } = this
    }
  },

  watch: {
    source (val) {
      if (this.target && this.target === val) this.target = null

      this.confirm = false
    }
  }
}
</script>
