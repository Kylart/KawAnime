<template lang="pug">
  v-dialog(v-model='show', persistent, lazy, absolute, max-width='800', @keydown.esc='close()')
    v-card.pa-2
      v-card-title.entry-title.grey--text
        .text-uppercase(xs9, offset-xs1) {{ addOrEdit }} a list entry
        span {{ entryTitle }}
        v-spacer
        v-btn(icon, outline, @click='close')
          v-icon close

      v-divider

      v-card-text
        v-container(grid-list-md, pb-0, pt-0)
          v-layout(row, wrap, justify-space-around)
            v-flex(xs4)
              v-select(
                label='Status'
                :items='status',
                v-model='form.status',
                hint='Where would you place this anime?',
                persistent-hint,
                item-value='value',
                item-text='text'
              )
            v-flex(xs4)
              v-text-field(
                type='number',
                min='0',
                :max='nbEpisodes || 999',
                label='Episode',
                v-model='form.progress',
                persistent-hint,
                hint='How many episode have you watched?'
              )
            v-flex(xs2)
              v-switch(
                label='Private?',
                v-model='form.private',
                color='primary'
              )
            template(v-for='i in 2')
              v-flex(xs3)
                v-menu(
                  lazy,
                  :close-on-content-click='false',
                  v-model='datePickers[i - 1]',
                  transition='scale-transition',
                  offset-y,
                  full-width,
                  :nudge-right='40',
                  max-width='290px',
                  min-width='290px'
                )
                  v-text-field(
                    slot='activator',
                    :label="`${i === 1 ? 'Start' : 'End'} date`",
                    v-model="dates[i === 1 ? 'start' : 'end']",
                    prepend-icon='event',
                    readonly
                  )
                  v-date-picker(v-model="dates[i === 1 ? 'start' : 'end']", no-title, scrollable, actions)
                    template(slot-scope='{ save, cancel }')
                      v-card-actions
                        v-spacer
                        v-btn(flat, color='primary', @click='cancel') Cancel
                        v-btn(flat, color='primary', @click='save') Ok
            v-flex(xs3)
              v-text-field(
                type='number',
                label='Score',
                v-model='form.score',
                hint='What mark?',
                persistent-hint,
                item-value='value',
                item-text='text'
              )
            v-flex(xs3)
              v-text-field(
                type='number',
                label='Time rewatched',
                hint='How many times?',
                persistent-hint,
                v-model='form.repeat'
              )
            v-flex(xs12, pt-2)
              v-textarea(
                label="Custom notes",
                outline,
                v-model='form.notes'
              )

      v-divider

      v-card-actions
        v-layout(justify-space-around)
          v-btn(@click='submit()') submit
          v-btn.red.lighten-1(@click='deleteEntry()') delete
</template>

<script>
export default {
  data () {
    return {
      service: 'anilist',
      datePickers: [false, false],
      status: [
        { text: 'Watching', value: 'CURRENT' },
        { text: 'Rewatching', value: 'REPEATING' },
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Paused', value: 'PAUSED' },
        { text: 'Dropped', value: 'DROPPED' },
        { text: 'Plan to watch', value: 'PLANNING' }
      ],
      initForm: {
        mediaId: '',
        status: '',
        score: '',
        progress: '',
        repeat: '',
        private: false,
        notes: '',
        startedAt: '',
        completedAt: ''
      },
      form: {
        mediaId: '',
        status: '',
        score: '',
        progress: '',
        repeat: '',
        private: false,
        notes: '',
        startedAt: '',
        completedAt: ''
      }
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.services[this.service].form.show
      },
      set (bool) {
        this.$store.commit('services/showForm', { service: this.service, bool })
      }
    },
    entry () {
      return this.$store.state.services[this.service].form.entry
    },
    entryTitle () {
      return this.entry.title
        ? ': ' + (this.entry.title || this.entry.name)
        : ''
    },
    nbEpisodes () {
      return this.entry.nbEp
    },
    isEdit () {
      return !!this.entry.isEdit
    },
    addOrEdit () {
      return this.isEdit ? 'Edit' : 'Add'
    },
    dates () {
      return {
        start: this.form.startedAt,
        end: this.form.completedAt
      }
    }
  },
  methods: {
    close () {
      this.$store.commit('services/showForm', { service: this.service, bool: false })
      this.form = this.initForm
    },
    submit () {
      // const id = this.entry.id || this.entry.animeId
      const opts = { ...this.form }

      opts.startedAt = this.parseDate(opts.startedAt)
      opts.completedAt = this.parseDate(opts.completedAt)
      opts.score = +opts.score
      opts.repeat = +opts.repeat

      this.$store.dispatch('services/updateList', {
        service: this.service,
        args: opts
      })

      this.close()
    },
    deleteEntry () {
      this.close()
    },
    parseDate (date) {
      const [ year, month, day ] = date.split('-')

      return {
        year: +year,
        month: +month,
        day: +day
      }
    },
    formatDate (date) {
      return [ date.year, ('0' + date.month).slice(-2), ('0' + date.day).slice(-2) ].join('-')
    }
  },
  watch: {
    async entry (obj) {
      if (this.isEdit) {
        this.form.mediaId = obj.id
        this.form.status = obj.status.toUpperCase()
        this.form.score = obj.score || null
        this.form.progress = obj.progress || null
        this.form.repeat = obj.repeat || null
        this.form.notes = obj.note || obj.notes || null
        this.form.startedAt = obj.startedAt.year
          ? this.formatDate(obj.startedAt)
          : null
        this.form.completedAt = obj.completedAt.year
          ? this.formatDate(obj.completedAt)
          : null
      }

      // const { id, name, url } = obj
      // const handler = (e, data) => {
      //   this.$store.commit('services/setFormEntry', { id, ...data })
      //   this.$ipc.removeListener(this.$eventsList.search.url.main, handler)
      // }

      // if (name) {
      //   this.$ipc.on(this.$eventsList.search.url.main, handler)
      //   this.$ipc.send(this.$eventsList.search.url.main, {
      //     provider: 'mal',
      //     toSearch: url
      //   })
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .entry-title
    font-weight 400
    font-size 18px

    span
      font-style italic
      font-size 20px
</style>
