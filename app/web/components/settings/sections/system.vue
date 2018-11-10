<template lang="pug">
  //- We need notification sound choice.
  v-card.elevation-12
    v-card-title.section-title System configuration
    v-divider
    v-card-text
      v-container(grid-list-lg, pa-0, pb-2)
        v-layout(row, wrap, justify-space-around, align-center)
          v-flex(xs12, sm6, md4)
            v-switch.mt-0(
              label='Tray'
              v-model='tray',
              color='primary',
              :label="tray ? 'Yes' : 'No'"
              persistent-hint,
              hint='*Should KawAnime be in your tray?'
            )
          v-flex(xs12, sm6, md4)
            v-switch.mt-0(
              label='Start on boot'
              v-model='autoStart',
              color='primary',
              :label="autoStart ? 'Yes' : 'No'"
              persistent-hint,
              hint='*Should KawAnime start on boot?'
            )

      v-container(grid-list-lg, pa-0, mt-3)
        v-layout(row, wrap, justify-space-around, align-center)
          v-flex(xs12, sm6, md3)
              v-text-field(
                label='Window\'s width',
                v-model='width',
                type='number',
                :min='minSize',
                persistent-hint,
                hint='How wide the window is.'
              )
          v-flex(xs12, sm6, md3)
            v-text-field(
              label='Window\'s height',
              v-model='height',
              type='number',
              :min='minSize',
              persistent-hint,
              hint='How high the window is.'
            )

      v-container(grid-list-lg, pa-0, mt-2)
        v-layout(row, wrap, justify-space-around, align-center)
          v-flex(xs12, sm4, md4)
              v-text-field(
                label='Window\'s x position',
                v-model='windowX',
                type='number',
                min='0',
                :disabled='center',
                persistent-hint,
                hint='Distance (in px) from the left of the screen.'
              )
          v-flex(xs12, sm4, md4)
            v-text-field(
              label='Window\'s y position',
              v-model='windowY',
              type='number',
              min='0',
              :disabled='center',
              persistent-hint,
              hint='Distance (in px) from the top of the screen.'
            )
          v-flex(xs12, sm4, md2)
            v-switch.mt-0(
              v-model='center',
              color='primary',
              :label="center ? 'Yes' : 'No'",
              persistent-hint,
              hint='Toggle to center.'
            )
    v-card-actions.pr-3.pl-3
      v-spacer
      span.conditions * Changes will be applied after restart
</template>

<script>
import { debounce } from 'lodash'

// Mixins
import Update from 'mixins/config/update.js'

export default {
  name: 'System-Section',

  mixins: [ Update ],

  mounted () {
    this.center = this.windowX === null
  },

  data: () => ({
    minSize: 200,
    center: false
  }),

  computed: {
    isBrowser () {
      return !window.navigator.appVersion.includes('Electron')
    },

    bounds: {
      get () {
        return this.config.bounds
      },
      set () {}
    },
    system: {
      get () {
        return this.config.system
      },
      set () {}
    },

    autoStart: {
      get () {
        return this.system.autoStart
      },
      set (val) {
        this.setDeepValue('system.autoStart', val)
      }
    },
    tray: {
      get () {
        return this.system.toTray
      },
      set (val) {
        this.setDeepValue('system.toTray', val)
      }
    },
    height: {
      get () {
        return this.bounds.height
      },
      set (val) {
        if (val >= this.minSize) {
          this.setDeepValue('bounds.height', +val)
          this.updateSize()
        }
      }
    },
    width: {
      get () {
        return this.bounds.width
      },
      set (val) {
        if (val >= this.minSize) {
          this.setDeepValue('bounds.width', +val)
          this.updateSize()
        }
      }
    },
    windowX: {
      get () {
        return this.bounds.x
      },
      set (val) {
        if (val > 0) {
          this.setDeepValue('bounds.x', +val)
          this.updatePosition()
        }
      }
    },
    windowY: {
      get () {
        return this.bounds.y
      },
      set (val) {
        if (val > 0) {
          this.setDeepValue('bounds.y', +val)
          this.updatePosition()
        }
      }
    }
  },

  methods: {
    updateSize: debounce(async function () {
      await this.$axios.get('/_win/set/size', {
        params: this.bounds
      })
    }, 300),
    updatePosition: debounce(async function () {
      await this.$axios.get('/_win/set/position', {
        params: this.bounds
      })
    }, 300)
  },

  watch: {
    async center (bool) {
      if (bool) {
        const { data } = await this.$axios.get('/_win/set/position', {
          params: { x: null, y: null }
        })

        this.setValue('bounds', data)
      }
    }
  }
}
</script>
