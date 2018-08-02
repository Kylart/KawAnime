process.on('uncaughtException', (err) => {
  console.error('Uncaught exception occurred in main process.\n', err)
})

process.on('SIGTERM', () => {
  process.server && process.server.close()
})
