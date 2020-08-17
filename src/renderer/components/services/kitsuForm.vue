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
        v-container(grid-list-md, pb-0, pt-0)
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
                      v-model="form[i === 1 ? 'startedAt' : 'finishedAt']",
                      prepend-icon='event',
                      readonly
                      v-on='on'
                    )
                  v-date-picker(
                    v-model="form[i === 1 ? 'startedAt' : 'finishedAt']",
                    @input='datePickers[i - 1] = false',
                    scrollable
                  )
            v-col(cols='3')
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
            v-col(cols='3')
              v-text-field(
                type='number',
                label='Time rewatched',
                hint='How many times?',
                persistent-hint,
                v-model='form.reconsumeCount'
              )
            v-col.pt-2(cols='2')
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
      const opts = {}
      const base = this.entry

      // Making a simple diff to send only required data.
      Object.keys(this.form).forEach((key) => {
        if (key.includes('At')) {
          const baseValue = base[key] ? this.formatDate(base[key]) : null

          if (this.form[key] !== baseValue) opts[key] = this.form[key]
        } else {
          if (`${this.form[key]}`.toLowerCase() !== `${base[key]}`.toLowerCase()) opts[key] = this.form[key]
        }
      })

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
      return new Date(date).toISOString().substr(0, 10)
    }
  },
  watch: {
    async entry (obj) {
      if (this.isEdit) {
        this.form.status = obj.status.toLowerCase().replace(/\s/g, '_')
        this.form.ratingTwenty = obj.score
        this.form.progress = obj.progress
        this.form.reconsuming = obj.reconsuming
        this.form.reconsumeCount = obj.reconsumeCount || 0
        this.form.notes = obj.note
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
