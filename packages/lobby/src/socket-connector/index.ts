import { Socket } from '@werewolf/socket'
import { Card, User } from '@werewolf/werewolf'
import { RedisClient } from 'redis'
import emitter from 'socket.io-emitter'
import { Lobby } from '..'
import { WerewolfCard } from '../../../werewolf/src/cards/werewolf'
import { LobbyUser } from '../user'


interface Message {
  user?: LobbyUser;
  except?: LobbyUser;
  message: string;
  attrs?: Record<string, any>;
}

const presenceSocket = new Socket()
export function connect(lobby: Lobby, pubClient: RedisClient, subClient: RedisClient) {

  presenceSocket.attach(null, pubClient, subClient)
  const io = emitter(pubClient as any)

  async function sendTo(user: User, msg: string, attrs: Record<string, any>) {
    const userPresence = await presenceSocket.presence.getSocketIdByUserId(user.id)
    if (userPresence) {
      attrs = attrs ? attrs : {}
      attrs.lobby = lobby.toObject()
      io.to(userPresence.socketId).emit(msg, attrs)
    }
  }

  function sendMessage(message: Message) {
    let users: LobbyUser[] = []
    if (message.user) {
      users = [message.user]
    } else if (message.except) {
      users = lobby.users.filter(u => u.user.id !== message.except.user.id)
    } else {
      users = lobby.users
    }
    users.forEach(u => sendTo(u.user, message.message, message.attrs))
  }

  function sendCardTo(user: LobbyUser) {
    sendMessage({
      user,
      message: 'lobby.card',
      attrs: {
        card: user.originalCard.toObject(),
      }
    })
  }

  function sendRefresh() {
    sendMessage({
      message: 'lobby.refresh',
    })
  }

  function sendTurnStart(user: LobbyUser, card: Card, data: any) {
    sendMessage({
      user,
      message: 'lobby.turn.mine.start',
      attrs: {
        card: card.toObject(),
        data,
      }
    })

  }

  lobby.on('left', () => {
    sendRefresh()
  })

  lobby.on('joined', async (user) => {
    sendRefresh()
  })

  lobby.on('connect', async (user) => {
    sendMessage({
      message: 'lobby.join',
      attrs: {
        user,
      }
    })
  })

  lobby.on('cards.set', () => {
    sendRefresh()
  })

  lobby.on('start', () => {
    sendRefresh()
  })

  lobby.on('user.claimed', () => {
    sendRefresh()
  })

  lobby.on('user.voted', () => {
    sendRefresh()
  })

  lobby.on('end', (winners) => {
    sendMessage({
      message: 'lobby.end',
      attrs: {
        winners,
        lynched: lobby.highestVoted.toObject(),
        users: lobby.users.map(u => {
          return {
            card: u.card.toObject(),
            ...u.toObject(),
            hasMarkOfAssassin: u.hasMarkOfAssassin,
          }
        }),
        middle: lobby.middle.map(u => {
          return {
            card: u.card.toObject(),
            ...u.toObject(),
            hasMarkOfAssassin: u.hasMarkOfAssassin,
          }
        }),
        actions: lobby.actions,
      }
    })

  })


  lobby.on('jury', ({timeLeft}) => {
    sendMessage({
      message: 'lobby.jury',
      attrs: {
        timeLeft,
      }
    })
  })

  lobby.on('restart', (id) => {
    sendMessage({
      message: 'lobby.restart',
      attrs: {
        id,
      }
    })
  })

  lobby.on('dealt', () => {
    lobby.users.forEach(sendCardTo)
  })

  lobby.on('turn.timer', ({timeLeft}) => {
    sendMessage({
      message: 'lobby.turn.timer',
      attrs: {
        timeLeft,
      }
    })
  })

  lobby.on('doppelganger.turn', ({ user, card, data }) => {
    sendTurnStart(user, card, data)
  })

  lobby.on('turn.start', ({ card, data }) => {
    sendMessage({
      message: 'lobby.turn.start',
      attrs: {
        card: card.toObject(),
      }
    })

    let users = lobby.users.filter(u => u.originalCard.constructor.name === card.constructor.name || (u.copycat && u.copycat.constructor.name === card.constructor.name))

    if (card.constructor.name === WerewolfCard.name) {
      users = lobby.users.filter(u => u.originalCard.isWerewolf)
    }

    users.forEach(u => {
      sendTurnStart(u, card, data)
    })
  })

  lobby.on('turn.end', ({ card }) => {
    lobby.users.filter(u => u.originalCard.constructor.name === card.constructor.name).forEach(u => {
      sendMessage({
        user: u,
        message: 'lobby.turn.mine.end',
        attrs: {
          card: card.toObject(),
        }
      })
    })

    sendMessage({
      message: 'lobby.turn.end',
      attrs: {
        card: card.toObject(),
      }
    })
  })

  subClient.on('message', (channel, message) => {
    const msg = JSON.parse(message)
    if (msg.type === 'disconnect') {
      const user = lobby.users.find(u => u.user.id === msg.obj)
      if (user) {
        sendMessage({
          message: 'lobby.disconnect',
          attrs: {
            user: user.user,
          },
        })
        if (!lobby.started) {
          lobby.removeUser(user.user)
        }
      }
    }
  })
  subClient.subscribe('presence')
}
