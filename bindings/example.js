const { parseName, torrent } = require('bindings')('kawabinds.node')

console.log(torrent)
console.log(parseName('[Ouroboros]_Fullmetal_Alchemist_Brotherhood_-_01.mkv'))
