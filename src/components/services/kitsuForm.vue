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
                v-model='form.ratingTwenty',
                hint='What mark?',
                min='0',
                max='20',
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
                v-model='form.reconsumeCount'
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
      service: 'kitsu',
      datePickers: [false, false],
      status: [
        { text: 'Current', value: 'current' },
        { text: 'Completed', value: 'completed' },
        { text: 'On Hold', value: 'on_hold' },
        { text: 'Dropped', value: 'dropped' },
        { text: 'Planned', value: 'planned' }
      ],
      initForm: {
        status: '',
        progress: null,
        reconsuming: false,
        reconsumeCount: 0,
        notes: '',
        private: false,
        ratingTwenty: null,
        startedAt: '',
        finishedAt: ''
      },
      form: {
        status: '',
        progress: null,
        reconsuming: false,
        reconsumeCount: 0,
        notes: '',
        private: false,
        ratingTwenty: null,
        startedAt: '',
        finishedAt: ''
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
        end: this.form.finishedAt
      }
    }
  },
  methods: {
    close () {
      this.$store.commit('services/showForm', { service: this.service, bool: false })
      this.form = this.initForm
    },
    submit () {
      const opts = { ...this.form }

      opts.startedAt = opts.startedAt && this.parseDate(opts.startedAt)
      opts.finishedAt = opts.finishedAt && this.parseDate(opts.finishedAt)
      opts.ratingTwenty = +opts.ratingTwenty
      opts.reconsumeCount = +opts.reconsumeCount
      opts.progress = +opts.progress

      this.$store.dispatch('services/updateList', {
        service: this.service,
        args: {
          isEdit: this.isEdit,
          id: this.entry.id,
          data: opts
        }
      })

      this.close()
    },
    deleteEntry () {
      this.close()
    },
    parseDate (date) {
      return new Date(date).toISOString()
    },
    formatDate (date) {
      const _date = new Date(date)

      return [
        _date.getFullYear(),
        ('0' + (_date.getMonth() + 1)).slice(-2),
        ('0' + _date.getDate()).slice(-2)
      ].join('-')
    }
  },
  watch: {
    async entry (obj) {
      if (this.isEdit) {
        this.form.status = obj.status.toLowerCase().replace(/\s/g, '_')
        this.form.ratingTwenty = obj.score || null
        this.form.progress = obj.progress || null
        this.form.reconsuming = obj.reconsuming || null
        this.form.reconsumeCount = obj.reconsumeCount || 0
        this.form.notes = obj.note || obj.notes || null
        this.form.startedAt = obj.startedAt
          ? this.formatDate(obj.startedAt)
          : null
        this.form.finishedAt = obj.finishedAt
          ? this.formatDate(obj.finishedAt)
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
