<script>
import VSlider from 'vuetify/es5/components/VSlider/VSlider'
import { VScaleTransition } from 'vuetify/es5/components/transitions'

export default {
  name: 'player-slider',

  mixins: [ VSlider ],

  props: {
    buffer: Array,
    duration: {
      default: '00:00'
    },
    // Override
    thumbLabel: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    hover: false
  }),

  computed: {
    maxTime () {
      if (!this.duration) return 0

      const parts = this.duration.split(':')
      const isHours = parts.length === 3

      const hours = (isHours && parts[0]) || 0
      const minutes = (isHours && parts[1]) || parts[0] || 0
      const seconds = (isHours && parts[2]) || parts[1] || 0

      const result = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds)

      return result
    },
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        const { min, max } = this
        value = Math.min(Math.max(value, min), max)

        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    }
  },

  methods: {
    // Override
    getLabel (value) {
      const time = (value / 100) * this.maxTime

      const hours = Math.floor(time / 3600) || null
      const minutes = Math.floor(time / 60) || null
      const seconds = Math.floor(time % 60) || null

      let result = ''

      result += (hours && `${hours}:`) || ''
      result += `0${minutes || '00'}:`.slice(-3)
      result += `0${seconds || '00'}`.slice(-2)

      return this.$createElement('span', result)
    },
    // Override
    genThumbLabel (content) {
      return this.$createElement(VScaleTransition, {
        props: { origin: 'bottom center' }
      }, [
        this.$createElement(
          'div', {
            staticClass: 'thumb-container',
            directives: [{
              name: 'show',
              value: this.isFocused || this.isActive
            }]
          }, [
            this.$createElement(
              'div', this.setBackgroundColor(this.computedThumbColor, {
                staticClass: 'thumb-content'
              }), [ content ]
            )
          ]
        )
      ])
    },
    genBuffers () {
      const ticks = this.buffer.map(([start, end]) => {
        const span = this.$createElement('span', {
          class: 'slider__buffer',
          style: {
            left: `${start}%`,
            width: `${end - start}%`
          }
        })

        return span
      })

      return this.$createElement(
        'div',
        {
          class: 'slider__buffer-container'
        },
        ticks
      )
    },
    // Override
    genChildren () {
      return [
        this.genBuffers(),
        this.genInput(),
        this.genTrackContainer(),
        this.genSteps(),
        this.genThumbContainer(
          this.internalValue,
          this.inputWidth,
          this.isFocused || this.isActive,
          this.onThumbMouseDown
        )
      ]
    }
  }
}
</script>

<style lang="stylus">
.slider__buffer-container
  transform translate3d(0, -50%, 0)
  position absolute
  left 0
  height 2px
  width 100%
  top 50%
  overflow hidden

  .slider__buffer
    display inline-block
    vertical-align middle
    background-color #0D47A1
    height 2px
    position absolute
</style>

<style lang="stylus" scoped>
  .thumb-container
    position absolute
    left 0
    bottom 0

  .thumb-content
    display flex
    align-items center
    justify-content center
    font-size 14px
    font-weight 400
    letter-spacing 0.03em
    color #fff
    width 48px
    height 48px
    border-radius 50% 50% 0
    position absolute
    left 0
    bottom 100%
    user-select none

    transform translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)

    > *
      transform rotate(-45deg)
</style>
