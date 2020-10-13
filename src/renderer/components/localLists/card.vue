<template lang="pug">
  v-card.card(
    hover,
    :class="{ 'green darken-1': selected }",
    :style='cardStyle'
  )
    v-tooltip(top)
      span {{ entry.name }}

      template(v-slot:activator='{ on: tooltip }')
        v-container.pa-0.fill-height(fluid, v-on='tooltip')
          .d-flex.justify-space-between.ma-0.pr-1.fill-height.card-container

            //- Image
            v-img.img(
              @click='handleClick',
              :src='img',
              :lazy-src='img',
              :loading='!img',
              contain,
              position='left center'
            )

            //- Entry information
            .information.pa-2(@click='handleClick')
              .name.ellipsis {{ entry.name }}

              .progress
                v-progress-linear(
                  :value='progress.value',
                  height='15'
                )
                .text {{ progress.text }}

              v-container.py-0.actions
                v-row(justify='space-around')
                  template(v-for='action in actions')
                    v-col(:cols="actions.length === 2 ? '6' : '4'")
                      v-btn(
                        small,
                        :icon='!!action.icon',
                        @click.stop='action.cb',
                        v-show='action.show'
                      )
                        span {{ action.text }}
                        template(v-show='action.icon')
                          v-icon {{ action.icon }}

            //- Right side with checkbox and menu
            .menu
              v-checkbox.pl-2(
                @click='handleClick',
                v-model='selected',
                color='success',
                disabled,
                hide-details,
                height='10'
              )

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
            : { text: 'Unknown', value: 0 }
    }
  },

  methods: {
    changeProgress (value) {
      const { entry } = this

      value === 'max'
        ? (entry.progress = entry.nbEp)
        : (entry.progress += value)

      this.$store.dispatch('watchLists/add', entry)
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
      this.$store.commit('watchLists/setEntry', this.entry)
      this.$store.commit('watchLists/toggleForm', true)
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
    width 100%
    background-color rgba(30, 30, 30, 0.65)

    .img
      max-height 100%
      max-width 30%

    .information
      width 55%

      .name, .progress, .actions
        min-height 30%
        display flex
        align-items center

      .name
        line-height 22px
        font-size 20px
        letter-spacing 0.03em
        font-weight 500

      .progress
        .text
          padding 0 8px
          min-width 30%
          font-size 16px
          white-space nowrap

  .menu
    padding 8px 0 14px
    min-width 7%

    display flex
    flex-direction column
    justify-content space-between
    align-items center

    .btn
      background-color rgba(30, 30, 30, 0.5)
</style>
