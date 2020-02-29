<script>
export default {
  name: 'MpvWrapper',

  data: () => ({
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      'pointer-events': 'none' // Allows cursor to be handled directly by MPV?
    },
    plugin: null,
    mimeType: 'application/x-mpvjs',

    mouseClick: {
      left: 0,
      timeout: null
    }
  }),

  props: {
    onPropertyChange: {
      type: Function,
      default: () => {}
    },
    onReady: {
      type: Function,
      default: () => {}
    }
  },

  mounted () {
    this.$el.addEventListener('message', this._handleMessage)

    window.addEventListener('click', this.click)
    window.addEventListener('contextmenu', this.click)
    window.addEventListener('wheel', this.wheel)

    window.addEventListener('keydown', this.keypress)

    this.property('cursor-autohide', 'always')
  },

  beforeDestroy () {
    window.removeEventListener('click', this.click)
    window.removeEventListener('contextmenu', this.click)
    window.removeEventListener('wheel', this.wheel)

    window.removeEventListener('keydown', this.keypress)
  },

  methods: {
    /**
     * Send a command to the player.
     *
     * @param {string} cmd - Command name
     * @param {...*} args - Arguments
     */
    command (cmd, ...args) {
      args = args.map(arg => arg.toString())
      this._postData('command', [cmd].concat(args))
    },

    /**
     * Set a property to a given value.
     *
     * @param {string} name - Property name
     * @param {*} value - Property value
     */
    property (name, value) {
      this._postData('set_property', { name, value })
    },

    /**
     * Get a notification whenever the given property changes.
     *
     * @param {string} name - Property name
     */
    observe (name) {
      this._postData('observe_property', name)
    },

    /**
     * Send a key event through mpv's input handler, triggering whatever
     * behavior is configured to that key.
     *
     * @param {KeyboardEvent} event
     */
    keypress ({ key, shiftKey, ctrlKey, altKey }) {
      // Don't need modifier events.
      if ([
        'Escape', 'Shift', 'Control', 'Alt',
        'Compose', 'CapsLock', 'Meta'
      ].includes(key)) return

      if (key.startsWith('Arrow')) {
        key = key.slice(5).toUpperCase()
        if (shiftKey) {
          key = `Shift+${key}`
        }
      }
      if (ctrlKey) {
        key = `Ctrl+${key}`
      }
      if (altKey) {
        key = `Alt+${key}`
      }

      // Ignore exit keys for default keybindings settings.
      if ([
        'q', 'Q', 'ESC', 'POWER', 'STOP',
        'CLOSE_WIN', 'Ctrl+c',
        'AR_PLAY_HOLD', 'AR_CENTER_HOLD'
      ].includes(key)) return

      this.command('keypress', key)
    },

    /**
     * Handles left and right click events.
     * Reproduces native MPV bindings
     *
     * @param {MouseEvent} event
     */
    click (event) {
      event.preventDefault()

      // We don't want clicks that are on the control panel to get through
      const comesFromControls = event.path.find(({ className = '' }) => className.includes('controls-container'))

      if (comesFromControls) return

      const { type } = event
      const isLeftClick = type === 'click'

      if (!isLeftClick) {
        this.$emit('togglePlay')
      } else {
        ++this.mouseClick.left

        if (this.mouseClick.left === 2) {
          this.$emit('toggleFullScreen')

          this.mouseClick.left = 0
          clearTimeout(this.mouseClick.timeout)
        } else {
          this.mouseClick.timeout = setTimeout(() => {
            this.mouseClick.left = 0
          }, 300)
        }
      }
    },

    /**
     * Handles wheel events. Scrolling horizontally will seek the video while scrollling vertically
     * will increase or decrease the volume.
     *
     * @param {WheelEvent} event
     */
    wheel (event) {
      event.preventDefault()

      const { deltaX, deltaY } = event
      const isX = Math.abs(deltaX) >= Math.abs(deltaY)

      // I can't get this to work with mouse command so we'll use that.
      if (isX) this.command('keypress', deltaX < 0 ? 'RIGHT' : 'LEFT')
      else this.command('keypress', deltaY < 0 ? '9' : '0')
    },

    _postData (type, data) {
      this.$el.postMessage({ type, data })
    },
    _handleMessage ({ data: { type, data } }) {
      const actions = {
        property_change: () => this.onPropertyChange(data.name, data.value),
        ready: () => this.onReady(this)
      }
      const action = actions[type]

      action && action()
    }
  },

  render (h) {
    return this.$createElement('embed', {
      ref: 'plugin',

      staticClass: 'mpv-wrapper',
      style: this.style,
      attrs: {
        type: this.mimeType
      }
    })
  }
}
</script>
