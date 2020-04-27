import { log, isRoot } from '@/store/utils'

/**
 * Handler made to respond to downloader success event.
 *
 * @param {import('vuex').Commit} commit
 * @param {{ magnets: { magnets: String[] }, name: String, modal: Boolean }} data
 */
export function success (commit, data) {
  const { magnets: { magnets: links }, name, modal } = data

  if (!links.length) {
    commit('setInfoSnackbar', `Could not find any torrent for ${name}.`, isRoot)
    return
  }

  if (modal) {
    // Hides the downloader dialog
    commit('showPromptModal', false)

    // Show the magnets dialog
    commit('setModal', {
      show: true,
      title: name,
      magnets: links
    })
  }
}

/**
 * Handler made to respond to downloader error event.
 *
 * @param {String} msg Error message received from Nyaapi.
 */
export function error (msg) {
  log('API does not seem to be responding.', msg)
}
