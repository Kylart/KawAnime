<template lang="pug">
  v-dialog(v-model='show', persistent, lazy, absolute, max-width='800', @keydown.esc='close()')
    v-card.pa-2
      v-layout(row, wrap)
        v-flex.entry-title-generic.pa-2(xs9, offset-xs1) {{ addOrEdit }} a list entry
          span.entry-title {{ entryTitle }}
        v-flex(xs2)
          v-btn(icon, outline, @click='close')
            v-icon close
        v-flex(xs4, offset-xs1)
          v-select(
            label='Status'
            :items='status',
            v-model='form.status',
            hint='Where would you place this anime?',
            persistent-hint,
            item-value='value',
            item-text='text'
          )
        v-flex(xs4, offset-xs2)
          v-text-field(
            type='number',
            min='0',
            :max='nbEpisodes || 999',
            label='Episode',
            v-model='form.episode',
            persistent-hint,
            hint='How many episode have you watched?'
          )
        template(v-for='i in 2')
          v-flex(xs3, offset-xs1)
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
                v-model="form['date_' + (i === 1 ? 'start' : 'finish')]",
                prepend-icon='event',
                readonly
              )
              v-date-picker(v-model="form['date_' + (i === 1 ? 'start' : 'finish')]", no-title, scrollable, actions)
                template(slot-scope='{ save, cancel }')
                  v-card-actions
                    v-spacer
                    v-btn(flat, color='primary', @click='cancel') Cancel
                    v-btn(flat, color='primary', @click='save') Ok
        v-flex(xs2, offset-xs1)
          v-select(
            label='Score'
            :items='score',
            v-model='form.score',
            hint='What mark?',
            persistent-hint,
            item-value='value',
            item-text='text'
          )
      v-expansion-panel(popout)
        v-expansion-panel-content(ripple)
          div(slot='header') Advanced options
          v-layout(justify-center)
            v-flex(xs8)
              v-combobox(
                v-model="form.tags",
                label="Tags",
                chips,
                multiple
              )
          v-layout.pa-3(justify-space-between)
            v-flex(xs2)
              v-select(
                label='Priority'
                :items='priority',
                v-model='form.priority',
                hint='How important?',
                persistent-hint,
                item-value='value',
                item-text='text'
              )
            v-flex(xs2)
              v-select(
                label='Storage type'
                :items='storage',
                v-model='form.storage_type',
                hint='Where is it stored?',
                persistent-hint,
                item-value='value',
                item-text='text'
              )
            v-flex(xs3)
              v-select(
                label='Rewatch value'
                :items='rewatch',
                v-model='form.rewatch_value',
                hint='How important to rewatch?',
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
                v-model='form.times_rewatched'
              )
          v-layout(justify-center)
            v-flex(xs8)
              v-textarea(
                label="Comment",
                outline,
                v-model='form.comments'
              )
      v-layout(justify-center)
        v-flex.submit(xs6)
          v-btn(@click='submit()') submit
          v-btn.red.lighten-1(@click='deleteEntry()') delete
</template>

<script>
export default {
  data () {
    return {
      datePickers: [false, false],
      status: [
        { text: 'Watching', value: 1 },
        { text: 'Completed', value: 2 },
        { text: 'On Hold', value: 3 },
        { text: 'Dropped', value: 4 },
        { text: 'Plan to watch', value: 6 }
      ],
      score: [
        { text: 'None', value: null },
        { text: '1 - Appalling', value: 1 },
        { text: '2 - Horrible', value: 2 },
        { text: '3 - Very bad', value: 3 },
        { text: '4 - Bad', value: 4 },
        { text: '5 - Average', value: 5 },
        { text: '6 - Fine', value: 6 },
        { text: '7 - Good', value: 7 },
        { text: '8 - Very good', value: 8 },
        { text: '9 - Great', value: 9 },
        { text: '10 - Masterpiece', value: 10 }
      ].reverse(),
      storage: [
        { text: 'Hard Drive', value: 1 },
        { text: 'DVD / CD', value: 2 },
        { text: 'Retail DVD', value: 4 },
        { text: 'VHS', value: 5 },
        { text: 'External HD', value: 6 },
        { text: 'NAS', value: 7 },
        { text: 'Blu-ray', value: 8 },
        { text: 'None', value: 3 }
      ],
      priority: [
        { text: 'Low', value: 0 },
        { text: 'Medium', value: 1 },
        { text: 'High', value: 2 }
      ],
      rewatch: [
        { text: 'Very low', value: 1 },
        { text: 'Low', value: 2 },
        { text: 'Medium', value: 3 },
        { text: 'High', value: 4 },
        { text: 'Very high', value: 5 }
      ],
      initForm: {
        status: 1,
        episode: '',
        score: '',
        date_start: null,
        date_finish: null,
        tags: [],
        priority: 0,
        times_rewatched: 0,
        rewatch_value: null,
        storage_type: null,
        comments: ''
      },
      form: {
        status: 1,
        episode: '',
        score: '',
        date_start: null,
        date_finish: null,
        tags: [],
        priority: 0,
        times_rewatched: 0,
        rewatch_value: null,
        storage_type: null,
        comments: ''
      }
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.mal.form
      },
      set (bool) {
        this.$store.commit('mal/showForm', bool)
      }
    },
    entry () {
      return this.$store.state.mal.entry
    },
    entryTitle () {
      return ': ' + (this.entry.title || this.entry.name)
    },
    nbEpisodes () {
      return this.entry.nbEpisodes || this.entry.episodes
    },
    isEdit () {
      return this.entry.lastUpdate
    },
    addOrEdit () {
      return this.isEdit ? 'Edit' : 'Add'
    }
  },
  methods: {
    close () {
      this.$store.commit('mal/showForm', false)
      this.form = this.initForm
    },
    submit () {
      const id = this.entry.id
      const opts = this.$_.clone(this.form)

      opts.tags = opts.tags.join(', ')

      const formatDate = (date) => {
        if (date) {
          date = date.split('-')
          const d = date[2]
          const m = date[1]
          const y = date[0]

          return m + d + y
        } else {
          return null
        }
      }

      opts.date_start = formatDate(opts.date_start)
      opts.date_finish = formatDate(opts.date_finish)

      this.$store.dispatch('mal/actOnList', {
        type: {
          support: 'anime',
          action: this.isEdit ? 'update' : 'add'
        },
        id,
        opts
      })

      this.close()
    },
    deleteEntry () {
      const id = this.entry.id

      this.$store.dispatch('mal/actOnList', {
        type: {
          support: 'anime',
          action: 'delete'
        },
        id
      })

      this.$store.commit('mal/removeFromLists', id)
      this.close()
    }
  },
  watch: {
    async entry (obj) {
      if (this.isEdit) {
        this.form.status = obj.status
        this.form.score = obj.score || null
        this.form.episode = obj.nbWatchedEpisode || null
        this.form.date_start = obj.startDate || null
        this.form.date_finish = obj.endDate || null
        this.form.tags = obj.tags.length ? obj.tags.split(', ') : []
        this.form.date_start = obj.myStartDate === '0000-00-00' ? null : obj.myStartDate
        this.form.date_finish = obj.myEndDate === '0000-00-00' ? null : obj.myEndDate
      }

      const { id } = obj
      if (obj.name) {
        try {
          const { data } = await this.$axios.get(`getInfoFromMal`, {
            params: { url: obj.url }
          })

          this.$store.commit('mal/setEntry', { id, ...data })
        } catch (e) {
          console.error((new Date()).toLocaleTimeString(), e)
        }
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
