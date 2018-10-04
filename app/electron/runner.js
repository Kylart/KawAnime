const electron = require('electron')
const { join } = require('path')
const { spawn } = require('child_process')

function init ({ verbose }) {
  const electronProcess = spawn(electron, [join(__dirname, '..', 'index.js')])

  if (verbose) {
    electronProcess.stdout.on('data', (data) => {
      process.stdout.write(data)
    })

    electronProcess.stderr.on('data', (data) => {
      process.stderr.write(data)
    })

    electronProcess.on('close', (code) => {
      console.log(`> KawAnime successfully exited with code ${code}.`)
      console.log('> Thank you for using KawAnime, またね！')
    })
  }

  return electronProcess
}

module.exports = init
