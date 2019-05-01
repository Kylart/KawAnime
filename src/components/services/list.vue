<template lang="pug">
  v-data-table(
    v-model='selected',
    :headers='headers',
    :items='list',
    :search='term',
    item-key='id',
    class='elevation-1'
  )
    template(v-slot:items='props')
      td {{ props.item.title }}
      td.text-xs-right {{ props.item.score }}
      td.text-xs-right {{ props.item.progress }}
      td.text-xs-right {{ props.item.status }}
      td.text-xs-center {{ props.item.format }}
      td.text-xs-right {{ props.item[hasTags ? 'tags' : 'note'] }}
</template>

<script>
export default {
  name: 'Service-List',

  props: [ 'list', 'tags', 'term', 'hasTags' ],

  data () {
    return {
      selected: [],
      headers: [
        {
          text: 'Title',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: 'Score', value: 'score' },
        { text: 'Progress', value: 'progress' },
        { text: 'Status', value: 'status' },
        { text: 'Format', value: 'format' },
        {
          text: this.hasTags ? 'Tags' : 'Note',
          value: this.hasTags ? 'tags' : 'note'
        }
      ]
    }
  },

  computed: {
    isEmpty () {
      return this.list && this.list.length
    }
  }
}
</script>
