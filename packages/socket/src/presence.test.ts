import { JwtService } from '@werewolf/services'
import { User } from '@werewolf/werewolf'
import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import faker from 'faker'
import http from 'http'
import { AddressInfo } from 'net'
import redis, {RedisClient} from 'redis'
import io from 'socket.io-client'
import { app } from '../src/app'

chai.use(chaiSubset)

let socket: SocketIOClient.Socket
let httpServer
let httpServerAddr: AddressInfo
let user: User
let token: string
let pubClient: RedisClient
let subClient: RedisClient

before(async () => {
  user = {id: 'kdmsf', name: 'asd'}
  token = await JwtService.sign(user)

  pubClient = redis.createClient()
  subClient = redis.createClient()
  httpServer = http.createServer()
  httpServerAddr = httpServer.listen().address() as AddressInfo

  app.attach(httpServer, pubClient, subClient)
})

beforeEach(async () => {
  socket = io(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
    reconnectionDelay: 0,
    forceNew: true,
  })

  return await new Promise(done => {
    socket.on('connect', done)
  })
})

afterEach(done => {
  if (!socket.connected) {
    done()
  }
  socket.on('disconnect', () => done())
  // make this happen in real time
  app.presence.remove(socket.id)
  socket.close()
})

describe('socket', () => {

  it('list has our presence', async () => {
    const s = await app.presence.getSocketIdByUserId(user.id)
    expect(s.socketId).to.eq(socket.id)

    const p = await app.findByUserId(user.id)
    expect(p.id).to.eq(socket.id)
  })

  it('list has our connection', async () => {
    const list = await app.presence.list()


    expect(list).to.have.lengthOf(1)
    expect(list[0].socketId).to.eq(socket.id)
    expect(list[0].userId).to.eq(user.id)
  })

  it('gets messages', (done) => {
    const msg = faker.lorem.sentence()
    socket.once('test', (r: string) => {
      expect(r).to.eq(msg)
      done()
    })

    app.io.on('connection', (mySocket) => {
      expect(mySocket).not.to.be.undefined
    })

    app.io.emit('test', msg)
  })

  it('disconnect', (done) => {
    subClient.on('message', () => done())
    subClient.subscribe('presence')
    socket.disconnect()
  })

})
