export default function (torrents) {
  return torrents.map((torrent) => ({
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    timeRemaining: torrent.timeRemaining,
    received: torrent.received,
    downloaded: torrent.downloaded,
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
      path: file.path,
      done: file.done,
      progress: file.progress
    }))
  }))
}
