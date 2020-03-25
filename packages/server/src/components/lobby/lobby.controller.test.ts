import { JwtService } from '@werewolf/services'
import { app as socketApp } from '@werewolf/socket'
import { User } from '@werewolf/werewolf'
import chai, { expect } from 'chai'
import subset from 'chai-subset'
import http from 'http'
import { AddressInfo } from 'net'
import redis from 'redis'
import io from 'socket.io-client'
import { Lobbies } from '../../../../lobby/src'
import { MinionCard } from '../../../../werewolf/src/cards/minion'
import { RobberCard } from '../../../../werewolf/src/cards/robber'
import { TroublemakerCard } from '../../../../werewolf/src/cards/troublemaker'
import { VillagerCard } from '../../../../werewolf/src/cards/villager'
import { WerewolfCard } from '../../../../werewolf/src/cards/werewolf'
import { app } from '../../app'
import { request } from '../../test/helpers'

chai.use(subset)

describe('lobby controller', () => {
  let lobbyId: string
  let owner: User
  let user: User
  let socket: SocketIOClient.Socket
  let httpServer
  let httpServerAddr: AddressInfo
  let token: string

  before(async () => {
    const pubClient = redis.createClient()
    const subClient = redis.createClient()
    httpServer = http.createServer().listen()
    httpServerAddr = httpServer.address() as AddressInfo
    socketApp.attach(httpServer, pubClient, subClient)

    app.emit('setPubClient', pubClient)
    app.emit('setSubClient', subClient)

    owner = { name: 'bob', id: 'maksndj' }
    user = { name: 'notbob', id: 'makfsndj'}
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


    return await new Promise(done => {
      socket.on('connect', done)
    })

  })

  after(async () => {
    socket.disconnect()
  })

  it('creates lobbies', async () => {

    await new Promise(async resolve => {
      socket.once('lobby.refresh', async ({lobby: {users}}: any) => {
        expect(users.map((r: any) => r.id)).to.eql([owner.id])
        resolve()
      })
      const response = await request('post', '/lobbies', {
        token,
      })

      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('users')
      expect(response.body.data).to.have.property('cards')

      lobbyId = response.body.data.id
    })


  })

  it('gets lobbies', async () => {
    const user = {name: 'bofxb', id: 'maksnsadj'}
    const response = await request('get', `/lobbies/${lobbyId}`, {
      user
    })

    expect(response.status).to.eq(200)
    expect(response.body.data).to.have.property('id')
    expect(response.body.data).to.have.property('users')
    expect(response.body.data).to.have.property('cards')
  })

  it('joins lobbies', async () => {
    await new Promise(async resolve => {
      socket.once('lobby.refresh', async ({ lobby: { users } }: any) => {
        expect(users.map((r: any) => r.id)).to.eql([owner.id, user.id])

        await request('post', `/lobbies/${lobbyId}/join`, {
          user: { name: 'baob', id: 'madsksndj' }
        })
        resolve()
      })
      const response = await request('post', `/lobbies/${lobbyId}/join`, {
        user
      })

      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('users')
      expect(response.body.data).to.have.property('cards')

    })
  })

  it('can\'t join lobby with same name as someone else', async () => {
    const newUser = { id: 'somethingelse', name: user.name }
    const response = await request('post', `/lobbies/${lobbyId}/join`, {
      user: newUser,
    })
    expect(response.status).to.eq(400)
  })

  it('can\'t join lobby with same name as someone else with different spaces n shit', async () => {
    const newUser = { id: 'somethingelse', name: `-${user.name}2 ` }
    const response = await request('post', `/lobbies/${lobbyId}/join`, {
      user: newUser,
    })
    expect(response.status).to.eq(400)
  })

  it('owner can change cards', async () => {

    await new Promise(async resolve => {
      socket.once('lobby.refresh', ({ card }: any) => {
        resolve()
      })
      const response = await request('put', `/lobbies/${lobbyId}/cards`, {
        token,
        data: {
          cards: [
            WerewolfCard.name,
            WerewolfCard.name,
            MinionCard.name,
            VillagerCard.name,
            RobberCard.name,
            TroublemakerCard.name,
          ],
        }
      })
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('success').eq(true)
      const c = Lobbies.get(lobbyId).cards
      expect(c[0].constructor.name).to.eq(WerewolfCard.name)
      expect(c[1].constructor.name).to.eq(WerewolfCard.name)
      expect(c[2].constructor.name).to.eq(MinionCard.name)
      expect(c[3].constructor.name).to.eq(VillagerCard.name)
      expect(c[4].constructor.name).to.eq(RobberCard.name)
      expect(c[5].constructor.name).to.eq(TroublemakerCard.name)
    })
  })

  let myCard: any
  it('owner can deal', async () => {

    await new Promise(async resolve => {
      socket.once('lobby.card', ({card}: any) => {
        myCard = card
        expect(card).to.have.property('description')
        expect(card).to.have.property('name')
        expect(card).to.have.property('id')
        resolve()
      })
      const response = await request('post', `/lobbies/${lobbyId}/deal`, {
        token,
      })
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('success').eq(true)

    })
  })


  it('player can get card after dealt', async () => {
    const response = await request('get', `/lobbies/${lobbyId}/card`, {
      token,
    })
    expect(response.status).to.eq(200)
    expect(response.body.data).to.containSubset(myCard)

  })

  it('owner can start', async () => {
    await new Promise(async resolve => {
      const lobby = Lobbies.get(lobbyId)
      let started = 0
      let ended = 0
      lobby.on('turn.start', () => {
        started++
      })
      lobby.on('turn.end', () => {
        ended++
      })
      lobby.on('jury', () => {
        expect(started - ended).to.eq(0)
        expect(started).to.eq(5)
        resolve()
      })
      const response = await request('post', `/lobbies/${lobbyId}/start`, {
        token,
      })
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.property('success').eq(true)
    })

  })

  it('can claim a card', async () => {
    const lobby = Lobbies.get(lobbyId)
    const response = await request('post', `/lobbies/${lobbyId}/claim`, {
      token,
      data: {
        id: WerewolfCard.name,
      },
    })
    expect(response.status).to.eq(200)
    const claim = lobby.users.find(u => u.user.id === owner.id).claim
    expect(claim).not.eq(false)
    expect(claim.toObject()).to.have.property('id').eq(WerewolfCard.name)
  })

  it('can vote for a player', async () => {
    const lobby = Lobbies.get(lobbyId)
    const response = await request('post', `/lobbies/${lobbyId}/vote`, {
      token,
      data: {
        id: user.id,
      },
    })
    expect(response.status).to.eq(200)
    const vote = lobby.users.find(u => u.user.id === owner.id).vote
    expect(vote).to.have.property('id').eq(user.id)
  })

  it('can vote for the middle', async () => {
    const lobby = Lobbies.get(lobbyId)
    const response = await request('post', `/lobbies/${lobbyId}/vote`, {
      token,
      data: {
        id: 'middle',
      },
    })
    expect(response.status).to.eq(200)
    const vote = lobby.users.find(u => u.user.id === owner.id).vote
    expect(vote).to.have.property('id').eq('middle')
  })

  it('owner can end', async () => {
    const response = await request('post', `/lobbies/${lobbyId}/end`, {
      token,
    })
    expect(response.status).to.eq(200)
  })
})
