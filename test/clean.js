const { homedir } = require('os')
const { join } = require('path')
const rimraf = require('rimraf')
const chalk = require('chalk')

const DIR = join(homedir(), '.KawAnime-test')

module.exports = () => {
  rimraf(DIR, (err) => {
    if (err) throw err

    console.log(chalk.green('> Cleared testing directory.'))
  })
}
