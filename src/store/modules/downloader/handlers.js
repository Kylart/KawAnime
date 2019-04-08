import { log, isRoot } from '@/store/utils'

export function success (commit, data) {
  const { magnets: { magnets: links }, name, modal } = data

  !links.length
    ? commit('setInfoSnackbar', `Could not find any torrent for ${name}.`, isRoot)
    : modal && commit('setModal', {
      show: true,
      title: name,
      magnets: links
    })
}

export function error (msg) {
  log('API does not seem to be reponding.', msg)
}
