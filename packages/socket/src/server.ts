import { config } from '@werewolf/config'
import { app } from '@werewolf/socket'
import http from 'http'
import redis from 'redis'

const server = http.createServer()

app.attach(server, redis.createClient(config.redis), redis.createClient(config.redis))
server.listen(3052)
