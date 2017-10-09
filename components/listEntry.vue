<template lang="pug">
  v-flex(
    xs12, sm6, md4, lg3,
    :class="item.split(' ').join('-')"
  ).elem
    v-card(v-ripple="true").elevation-3.elem-content
      v-layout(row, wrap)
        v-flex(xs2 @click.capture="select(item, index)").box
          v-checkbox(
            label="",
            accent,
            v-model="selected[index]",
            disabled,
            :value="item",
            dark
          )
        v-flex(xs8, @click.capture="select(item, index)")
          v-tooltip(top, open-delay='150')
            h6.ellipsis.elem-title.white--text(slot='activator') {{ item }}
            span {{ item }}
        v-flex(xs2)
          v-menu(bottom right)
            v-btn(icon slot="activator" dark)
              v-icon more_vert
            v-list.dark
              template(v-for="(button, i) in buttons")
                v-list-tile(@click="button.method(item)")
                  v-list-tile-action
                    v-icon {{ button.action }}
                  v-list-tile-title.white--text {{ button.text }}
</template>

<script>
  export default{
    props: {
      item: String,
      deleteEntry: Function,
      select: Function,
      selected: Object,
      index: Number
    },
    data () {
      const vm = this
      return {
        buttons: [
          {
            action: 'file_download',
            text: 'Download',
            method: (item) => vm.download(item)
          }, {
            action: 'info_outline',
            text: 'Information',
            method: (item) => vm.$store.dispatch('search/fromName', item)
          }, {
            action: 'delete_sweep',
            text: 'Delete this entry',
            method: (item) => vm.deleteEntry(item, vm.index)
          }
        ]
      }
    },
    methods: {
      download (name) {
        this.$store.dispatch('downloader/download', {
          name,
          isDownloader: false
        })
      }
    }
  }
</script>

<style scoped>
  .card__text
  {
    padding-top: 0;
  }

  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .elem-content
  {
    margin-left: 5px;
    position: relative;
    background-color: rgb(60, 60, 60);
    height: 45px !important;
  }

  .elem-content:hover
  {
    transition: all 0.25s;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .elem
  {
    padding: 5px 5px 5px 5px;
    display: inline-block;
    width: 100%;
  }

  .elem .input-group
  {
    margin: 0;
    padding: 0;
  }

  .box
  {
    padding-top: 10px;
    padding-left: 13px;
  }

  .elem-title
  {
    line-height: 24px;
    font-size: 20px;
    padding-top: 10px;
    padding-left: 10px;
  }

  .selected
  {
    background-color: #2E7D32;
  }
</style>
