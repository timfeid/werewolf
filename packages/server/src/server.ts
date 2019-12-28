import { config } from '@werewolf/config'
import { Socket } from '@werewolf/socket'
import redis from 'redis'
import { app } from './app'

const presence = new Socket()
const pubClient = redis.createClient(config.redis)
const subClient = redis.createClient(config.redis)
presence.attach(null, pubClient, subClient)
app.emit('setPubClient', pubClient)
app.emit('setSubClient', subClient)
app.emit('setPresence', presence)
app.listen(8082)
console.log('listening')

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
