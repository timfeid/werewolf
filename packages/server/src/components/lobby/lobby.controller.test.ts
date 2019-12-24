import { User } from '@salem/data'
import { UserFactory } from '@salem/factories'
import { JwtService } from '@salem/services'
import { app as socketApp, Socket } from '@salem/socket'
import { expect } from 'chai'
import http from 'http'
import { AddressInfo } from 'net'
import redis from 'redis-mock'
import io from 'socket.io-client'
import { app } from '../../app'
import { request } from '../../test/helpers'

describe('lobby controller', () => {
  let lobbyId: string
  let owner: User
  let socket: SocketIOClient.Socket
  let httpServer
  let httpServerAddr: AddressInfo
  let token: string

  before(async () => {
    const redisClient = redis.createClient()
    httpServer = http.createServer().listen()
    httpServerAddr = httpServer.address() as AddressInfo
    socketApp.attach(httpServer, redisClient)

    const s = new Socket()
    s.attach(httpServer, redisClient)

    app.emit('setPresence', s)

    owner = await UserFactory.create()
    token = await JwtService.sign(owner)


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

    socket.on('error', console.log.bind(console))
    socket.on('disconnect', () => console.log('???'))


    return await new Promise(done => {
      socket.on('connect', done)
    })

  })

  it('creates lobbies', async () => {

    await new Promise(async resolve => {
      socket.once('lobby.users', () => {
        resolve()
      })
      const response = await request('post', '/lobbies', {
        token,
      })

      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('users')
      expect(response.body.data).to.have.property('deck')

      lobbyId = response.body.data.id
    })


  })

  it('gets lobbies', async () => {
    const user = await UserFactory.create()
    const response = await request('get', `/lobbies/${lobbyId}`, {
      user
    })

    expect(response.status).to.eq(200)
    expect(response.body.data).to.have.property('id')
    expect(response.body.data).to.have.property('users')
    expect(response.body.data).to.have.property('deck')
  })

  it('joins lobbies', async () => {
    const user = await UserFactory.create()

    await new Promise(async resolve => {
      socket.once('lobby.users', async ({ users }: any) => {
        expect(users.map((r: any) => r.id)).to.eql([owner.id, user.id])

        await request('post', `/lobbies/${lobbyId}/join`, {
          user
        })
        resolve()
      })
      const response = await request('post', `/lobbies/${lobbyId}/join`, {
        user
      })

      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('users')
      expect(response.body.data).to.have.property('deck')

    })
  })

  it('owner can deal', async () => {

    await new Promise(async resolve => {
      socket.once('lobby.start', ({card}: any) => {
        expect(card).to.have.property('description')
        expect(card).to.have.property('name')
        expect(card).to.have.property('id')
        resolve()
      })
      const response = await request('post', `/lobbies/${lobbyId}/start`, {
        token,
      })
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('success').eq(true)

    })
  })

})
