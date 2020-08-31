<template lang="pug">
  v-dialog(
    v-model='show',
    width='65%'
  )
    template(v-slot:activator='{ on: dialog }')
      v-tooltip(top)
        template(v-slot:activator='{ on: tooltip }')
          v-btn(v-on='{ ...dialog, ...tooltip }', icon, large)
            v-icon(large) import_export
        span Transfer Lists

    v-card
      v-card-title.grey--text.text-uppercase
        v-spacer
        span Transfer Lists
        v-spacer

      v-divider

      v-card-text
        v-container
          .d-flex.flex-column.justify-space-between.align-center
            v-select(
              label='From',
              hint='Which list to export.',
              persistent-hint,
              :items='sources',
              v-model='source'
            )

            v-scale-transition(group)
              template(v-if='source')
                v-icon(large, key='icon') keyboard_arrow_down

                v-select(
                  key='select',
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
                | to #[b {{ targetName }}] list. Are you sure?

              v-btn(@click='transfer') Yes!

              v-btn.blue--text(text, @click='confirm = false') Nevermind!

            template(v-else)
              v-btn(@click='confirm = true') Transfer!

              v-btn.blue--text(text, @click='close') Cancel
</template>

<script>
export default {
  name: 'Service-Import',

  data: () => ({
    confirm: false,
    show: false,
    source: null,
    target: null,
    availableSources: [
      { text: 'Local', value: 'local' },
      { text: 'MyAnimeList.net', value: 'mal' },
      { text: 'Anilist.co', value: 'anilist' },
      { text: 'Kitsu.io', value: 'kitsu' }
    ],
    excludedTargets: ['mal', 'anilist', 'kitsu'],
    statusValues: {
      watchList: ['Plan to watch', 'Planned', 'Planning'],
      watching: ['Watching', 'Current'],
      seen: ['Completed'],
      dropped: ['Dropped'],
      onHold: ['On Hold', 'Paused']
    }
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
    sources () {
      return this.availableSources
        .filter(({ value }) => value === 'local' || this.$store.state.services[value].list)
    },
    targets () {
      if (!this.source) return []

      return this.sources.filter(({ value }) => value !== this.source && !this.excludedTargets.includes(value))
    }
  },

  methods: {
    close () {
      this.show = false
    },
    success () {
      this.close()
    },
    transfer () {
      const { source, target } = this

      if (target === 'local') {
        this.importToLocal(source)
      }
    },
    importToLocal (source) {
      this.loading = true
      const sourceList = this.$store.state.services[source].list

      sourceList.forEach((entry) => {
        const { status } = entry
        const localStatus = Object.keys(this.statusValues)
          .find((key) => this.statusValues[key].includes(status))

        const newEntry = {
          list: localStatus,
          name: entry.title,
          progress: entry.progress || 0,
          nbEp: entry.nbEp,
          note: entry.note || '',
          tags: entry.tags || [],
          img: entry.img
        }

        this.$store.dispatch('watchLists/add', newEntry)
      })

      this.success()
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
