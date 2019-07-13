import { join } from 'path'

export default function (torrents) {
  return torrents.map((torrent) => ({
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    timeRemaining: torrent.timeRemaining,
    received: torrent.received,
    downloaded: torrent.downloaded,
    size: torrent.size,
    uploaded: torrent.uploaded,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
    progress: torrent.progress,
    ratio: torrent.ratio,
    numPeers: torrent.numPeers,
    path: torrent.path,
    ready: torrent.ready,
    files: torrent.files.map((file) => ({
      name: file.name,
      path: join(torrent.path, file.path),
      done: file.done,
      length: file.length,
      downloaded: file.downloaded,
      progress: file.progress
    }))
  }))
}
