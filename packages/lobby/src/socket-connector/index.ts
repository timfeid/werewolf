import { Socket } from '@werewolf/socket'
import { User } from '@werewolf/werewolf'
import { RedisClient } from 'redis'
import emitter from 'socket.io-emitter'
import { Lobby } from '..'
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


  lobby.on('joined', () => {
    sendRefresh()
  })

  lobby.on('cards.set', () => {
    sendRefresh()
  })

  lobby.on('start', () => {
    sendRefresh()
  })


  lobby.on('jury', ({timeLeft}) => {
    sendMessage({
      message: 'lobby.jury',
      attrs: {
        timeLeft,
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

  lobby.on('turn.start', ({ card, data }) => {
    sendMessage({
      message: 'lobby.turn.start',
      attrs: {
        card: card.toObject(),
      }
    })

    lobby.users.filter(u => u.originalCard.constructor.name === card.constructor.name).forEach(u => {
      sendMessage({
        message: 'lobby.turn.mine.start',
        user: u,
        attrs: {
          card: card.toObject(),
          data,
        }
      })
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

}
