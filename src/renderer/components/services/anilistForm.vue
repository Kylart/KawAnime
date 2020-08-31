<template lang="pug">
  v-dialog(v-model='show', persistent, absolute, max-width='800', @keydown.esc='close')
    v-card.pa-2
      v-card-title.entry-title.grey--text
        .text-uppercase(cols='9', offset='1') {{ addOrEdit }} a list entry
        span {{ entryTitle }}
        v-spacer
        v-btn(icon, outlined, @click='close')
          v-icon close

      v-divider

      v-card-text
        v-container.py-0
          v-row(justify='space-around')
            v-col(cols='4')
              v-select(
                label='Status'
                :items='status',
                v-model='form.status',
                hint='Where would you place this anime?',
                persistent-hint,
                item-value='value',
                item-text='text'
              )
            v-col(cols='4')
              v-text-field(
                type='number',
                min='0',
                :max='nbEpisodes || 999',
                label='Episode',
                v-model='form.progress',
                persistent-hint,
                hint='How many episode have you watched?'
              )
            v-col(cols='2')
              v-switch(
                label='Private?',
                v-model='form.private',
                color='primary'
              )
            template(v-for='i in 2')
              v-col(cols='3')
                v-menu(
                  ref='pickers',
                  v-model='datePickers[i - 1]',
                  :close-on-content-click='false',
                  :nudge-right='40',
                  transition='scale-transition',
                  offset-y,
                  full-width,
                  min-width='290px'
                )
                  template(v-slot:activator='{ on }')
                    v-text-field(
                      :label="`${i === 1 ? 'Start' : 'End'} date`",
                      v-model="form[i === 1 ? 'startedAt' : 'completedAt']",
                      prepend-icon='event',
                      readonly
                      v-on='on'
                    )
                  v-date-picker(
                    v-model="form[i === 1 ? 'startedAt' : 'completedAt']",
                    @input='datePickers[i - 1] = false',
                    scrollable
                  )
            v-col(cols='3')
              v-text-field(
                type='number',
                label='Score',
                v-model='form.score',
                hint='What mark?',
                persistent-hint,
                item-value='value',
                item-text='text'
              )
            v-col(cols='3')
              v-text-field(
                type='number',
                label='Time rewatched',
                hint='How many times?',
                persistent-hint,
                v-model='form.repeat'
              )
            v-col(cols='12', pt-2)
              v-textarea(
                label="Custom notes",
                outlined,
                v-model='form.notes'
              )

      v-divider

      v-card-actions
        v-row(justify='space-around')
          v-btn(@click='submit') submit
          v-btn.red.lighten-1(@click='deleteEntry') delete
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
        status: '',
        score: 0,
        progress: '',
        repeat: '',
        private: false,
        notes: '',
        startedAt: '',
        completedAt: ''
      },
      form: {
        status: '',
        score: 0,
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
      const opts = { mediaId: this.entry.mediaId, ...this.form }

      opts.startedAt = opts.startedAt ? this.parseDate(opts.startedAt) : undefined
      opts.completedAt = opts.completedAt ? this.parseDate(opts.completedAt) : undefined
      opts.score = opts.score ? +opts.score : 0
      opts.progress = opts.progress ? +opts.progress : undefined
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
      const [year, month, day] = date.split('-')

      return {
        year: +year,
        month: +month,
        day: +day
      }
    },
    formatDate (date) {
      return [date.year, ('0' + date.month).slice(-2), ('0' + date.day).slice(-2)].join('-')
    }
  },
  watch: {
    async entry (obj) {
      if (this.isEdit) {
        this.form.mediaId = obj.id
        this.form.status = obj.status.toUpperCase()
        this.form.score = obj.score || 0
        this.form.progress = +obj.progress || null
        this.form.repeat = obj.repeat || null
        this.form.notes = obj.note || obj.notes || null
        this.form.startedAt = obj.startedAt.year
          ? this.formatDate(obj.startedAt)
          : null
        this.form.completedAt = obj.completedAt.year
          ? this.formatDate(obj.completedAt)
          : null
      }
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
