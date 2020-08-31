<template lang="pug">
  v-data-table.mt-3(
    v-model='selected',
    :headers='headers',
    :items='filteredList',
    :search='term',
    :loading='isLoading',
    item-key='id',
    class='elevation-1',
    :footer-props='footerProps'
  )
    //- Slot example: https://vuetifyjs.com/en/components/data-tables#slots
    template(v-slot:body='{ items }')
      tbody
        tr(v-for='item in items', :key='item.name')
          td.thumbnail-container
            v-img(
              :src='item.img',
              :lazy-src='item.img',
              aspect-ratio='1',
              :max-height='70',
              contain
            )
              template(v-slot:placeholder)
                v-row.fill-height.ma-0(
                  align='center',
                  justify='center'
                )
                  v-progress-circular(indeterminate)
          td.entry-title {{ item.title }}
          td.text-xs-right.normal-text {{ item.status }}
          td.text-xs-right.normal-text {{ item.format }}
          td.text-xs-right.normal-text {{ item.score }}
          td
            v-tooltip(top)
              template(v-slot:activator='{ on }')
                .text-xs-right.normal-text.ellipsis(v-on='on') {{ item[hasTags ? 'tags' : 'note'] }}
              span {{ item[hasTags ? 'tags' : 'note'] }}
          td
            .d-flex.flex-column.justify-center.align-center
              span.pb-1 {{ item.progress }} / {{ item.nbEp || '??' }}
              v-progress-linear.ma-0(:value='(item.progress / item.nbEp) * 100', :max='item.nbEp')
          template(v-if='isConnected')
            td
              v-btn(icon, @click='setModal(item)')
                v-icon edit
</template>

<script>
export default {
  name: 'Service-List',

  props: ['provider', 'list', 'tags', 'term', 'hasTags'],

  mounted () {
    this.setEdit()
  },

  data () {
    return {
      selected: [],
      footerProps: {
        'items-per-page-text': 'Anime per page:',
        'items-per-page-options': [10, 15, 25, 50, 100, { text: 'All', value: -1 }]
      },
      headers: [
        { text: 'Thumbnail', value: 'img', sortable: false, align: 'center' },
        {
          text: 'Title',
          align: 'left',
          value: 'title'
        },
        { text: 'Status', value: 'status', align: 'right' },
        { text: 'Format', value: 'format', align: 'right' },
        { text: 'Score', value: 'score', align: 'right' },
        {
          text: this.hasTags ? 'Tags' : 'Note',
          value: this.hasTags ? 'tags' : 'note',
          sortable: false,
          align: 'right'
        },
        { text: 'Progress', value: 'progress', align: 'center' }
      ]
    }
  },

  computed: {
    isConnected () {
      return this.$store.state.services[this.provider].isConnected
    },
    isLoading () {
      return this.$store.state.services[this.provider].isLoading
    },
    isEmpty () {
      return this.list && this.list.length
    },
    filteredList () {
      if (!this.hasTags || !this.tags || !this.tags.length) return this.list || []

      return this.list.filter(
        ({ tags }) => tags.split(', ').some((tag) => this.tags.includes(tag))
      )
    }
  },

  methods: {
    setModal (item) {
      this.$store.commit('services/showForm', { service: this.provider, bool: true })
      this.$store.commit('services/setFormEntry', {
        service: this.provider,
        entry: {
          ...item,
          isEdit: true
        }
      })
    },
    setEdit () {
      this.$nextTick(() => {
        const editIndex = this.headers.findIndex(({ text }) => text === 'Edit')
        const hasEdit = editIndex !== -1

        if (this.isConnected) {
          !hasEdit && this.headers.push({ text: 'Edit' })
        } else {
          hasEdit && this.headers.splice(editIndex, 1)
        }
      })
    }
  },

  watch: {
    provider () {
      this.setEdit()
    },
    isConnected () {
      this.setEdit()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .entry-title
    font-size 15px
    font-weight 300
    letter-spacing 0.04em

  .thumbnail-container
    max-width 100px

  .normal-text
    letter-spacing 0.02em
    max-width 250px
</style>
