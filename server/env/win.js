const actOnWin = ({query}, res) => {
  const {action} = query

  if (action === 'minimize') {
    process.win.minimize()
  } else if (action === 'maximize') {
    process.win.isMaximized()
      ? process.win.unmaximize()
      : process.win.maximize()
  } else if (action === 'close') {
    process.win.close()
  }

  res.status(200).send()
}

module.exports = {
  actOnWin
}
