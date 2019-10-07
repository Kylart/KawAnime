<template lang="pug">
  v-card.card(
    hover,
    :class="{ 'green darken-1': selected }",
    :style='cardStyle'
  )
    v-tooltip(top)
      span {{ entry.name }}

      template(v-slot:activator='{ on: tooltip }')
        .card-container(v-on='tooltip')
          v-img.img(
            @click='handleClick',
            :src='img',
            :lazy-src='img',
            :loading='!img',
            contain,
            position='left center'
          )

          .center-container(@click='handleClick')
            .name-container.text.ellipsis {{ entry.name }}

            .progress
              v-progress-linear(
                :value='progress.value',
                height='15'
              )
              span.text {{ progress.text }}

            v-container
              v-layout(justify-space-around)
                template(v-for='action in actions')
                  v-flex
                    v-btn(
                      small,
                      :icon='!!action.icon',
                      @click.stop='action.cb',
                      v-show='action.show'
                    ) {{ action.text }}
                      template(v-show='action.icon')
                        v-icon {{ action.icon }}

          .menu
            .checkbox(@click='handleClick')
              v-checkbox(v-model='selected', color='success', disabled, hide-details, height='10')

            v-menu(transition='slide-x-transition')
              template(v-slot:activator='{ on: menu }')
                v-btn.btn(v-on='menu', icon, large)
                  v-icon(large, color='secondary') more_horiz
              v-list
                v-list-item(
                  v-for='option in menus',
                  :key='option.icon',
                  @click='option.method'
                )
                  v-list-item-avatar
                    v-icon {{ option.icon }}
                  v-list-item-title {{ option.text }}
</template>

<script>
import { localLists } from '@/store/helpers'

export default {
  name: 'List-Card',

  props: ['entry', 'selected'],

  computed: {
    menus () {
      return [
        {
          icon: 'edit',
          text: 'Edit',
          method: () => this.edit()
        }, {
          icon: 'file_download',
          text: 'Download',
          method: () => this.download()
        }, {
          icon: 'tv',
          text: 'Watch',
          method: () => this.watch()
        }, {
          icon: 'info_outline',
          text: 'Information',
          method: () => this.search()
        }, {
          icon: 'delete_sweep',
          text: 'Delete this entry',
          method: () => this.$emit('delete')
        }
      ]
    },
    actions () {
      return [
        {
          icon: 'remove',
          cb: () => this.changeProgress(-1),
          show: true
        }, {
          icon: 'add',
          cb: () => this.changeProgress(1),
          show: true
        }, {
          text: 'Max',
          cb: () => this.changeProgress('max'),
          show: this.has.nbEp
        }
      ]
    },
    cardStyle () {
      return this.entry.bannerImg
        ? { backgroundImage: `url(${this.entry.bannerImg})` }
        : {}
    },
    img () {
      return this.entry.img
    },
    has () {
      return {
        progress: !!`${this.entry.progress}`,
        nbEp: this.entry.nbEp && this.entry.nbEp !== '??'
      }
    },
    progress () {
      const { has: { progress: hasProgress, nbEp: hasNbEp } } = this

      return hasProgress && hasNbEp
        ? { text: `${this.entry.progress} / ${this.entry.nbEp}`, value: (this.entry.progress / this.entry.nbEp) * 100 }
        : hasProgress
          ? { text: `${this.entry.progress} / ??`, value: 70 }
          : hasNbEp
            ? { text: `?? / ${this.entry.nbEp}`, value: 0 }
            : { text: `Unknown`, value: 0 }
    }
  },

  methods: {
    // Brings __llSet, __llToggleForm, __llSetEntry and __llResetEntry
    ...localLists.mutations,
    // Brings __llAdd, __llMove, __llDelete, __llGet and __llInfo
    ...localLists.actions,

    changeProgress (value) {
      const { entry } = this

      value === 'max'
        ? (entry.progress = entry.nbEp)
        : (entry.progress += value)

      this.__llAdd(entry)
    },
    handleClick () {
      this.$emit('clicked')
    },
    download () {
      const config = {
        fansub: this.$store.state.config.config.fansub,
        quality: this.$store.state.config.config.quality,
        feed: this.$store.state.config.config.feed,
        name: this.entry.name
      }

      this.$store.dispatch('downloader/download', config)
    },
    watch () {
      this.$router.push({ path: '/', query: { name: this.entry.name } })
    },
    search () {
      this.$store.commit('info/setTerm', this.entry.name)
      this.$store.commit('info/setRemote', true)
      this.$store.commit('info/showModal', true)
    },
    edit () {
      this.__llSetEntry(this.entry)
      this.__llToggleForm(true)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .card
    height 150px
    background-repeat no-repeat
    background-size cover
    background-position center center

  .card-container
    display flex
    justify-content space-between
    align-items center
    height 100%

  .img
    max-height 100%
    max-width 30%

  .menu
    padding 8px 0
    height 100%
    max-width 20%
    min-width 5%

    display flex
    flex-direction column
    justify-content space-between
    align-items center

    .btn
      background-color rgba(30, 30, 30, 0.5)

  .center-container
    padding 15px 8px
    height 100%
    width 55%
    display flex
    flex-direction column
    justify-content space-between
    align-items center

    .name-container
      width 100%

    .text
      line-height 22px
      font-size 20px
      letter-spacing 0.03em
      font-weight 500

    .progress
      width 100%
      display flex
      justify-content space-around
      align-items center

      .text
        padding 0 8px
        min-width 30%
        font-size 16px
        white-space nowrap

  .card-container
    background-color rgba(30, 30, 30, 0.65)
</style>
