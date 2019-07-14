export default {
  mounted () {
    this.$ipc.on(this.$eventsList.externalOpen.success, (e, args) => {
      const link = args.filter(
        (l) => l.includes(this.appProtocolName)
      )[0].replace('#', '&')

      if (!link) return

      /**
       *
       * This way, we can handle all the external opens like this:
       * The link most be formed this way:
       * kawanime-app://<SERVICE>?<ARG_KEY_1>=<ARG_VALUE_1>&<ARG_KEY_2>=<ARG_VALUE_2>
       * All args will then become an object like:
       * {
       *    <ARG_KEY_1>: <ARG_VALUE_1>,
       *    <ARG_KEY_2>: <ARG_VALUE_2>
       * }
       * Finally, this object will be fed to the <SERVICE>/external action.
       */
      const parts = link.replace(this.appProtocolName, '').split('?')
      const service = parts[0]
      const externalArgs = parts[1].split('&').reduce((acc, arg) => {
        const _parts = arg.split('=')
        acc[_parts[0]] = decodeURIComponent(_parts[1])

        return acc
      }, {})

      this.$store.dispatch('services/external', { service, ...externalArgs })
    })
  },

  data: () => ({
    appProtocolName: 'kawanime-app://'
  })
}
