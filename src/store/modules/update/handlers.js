import { log, isRoot } from '@/store/utils'

export const available = {
  success (commit) {
    commit('setRunning')
    log('An update is available.')
  }
}

export const installable = {
  success (commit) {
    commit('setStatus')
    commit('setInfoSnackbar', 'Update available. Think about installing it~', isRoot)
  }
}

export const progress = {
  success (progress) {
    log(`Update progress: ${progress.percent.toFixed(2)} at ${progress.bytesPerSecond.toFixed(2) / (10 ** 6)} MB/s.`)
  }
}
