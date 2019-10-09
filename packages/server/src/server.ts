import { app } from './app'

app.on('ready', () => {
  app.listen(8082)
})

process.on('SIGTERM', function () {
  console.log('SIGTERM: Exiting ...')
  process.exit(0)
})

process.on('SIGINT', function () {
  process.exit(-1)
})

// eslint-disable-next-line handle-callback-err
process.on('uncaughtException', function (err) {
  process.exit(-1)
})
