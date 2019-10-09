import { app } from '../app'

before((done: any) => {
  app.on('ready', done)
})

after(async () => {
  app.emit('stop')
})
