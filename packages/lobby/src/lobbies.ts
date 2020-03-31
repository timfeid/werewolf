import { User } from '@werewolf/werewolf'
import { RedisClient } from 'redis'
import { Lobby } from '.'
import { connect } from './socket-connector'

const lobbies: Record<string, Lobby> = {}

function makeid() {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ346789'
  const charactersLength = characters.length
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}


export function get(id: string) {
  return lobbies[id]
}

export function create(user: User, pubClient: RedisClient, subClient: RedisClient) {
  const lobbyId = makeid()
  const lobby = new Lobby(lobbyId)
  connect(lobby, pubClient, subClient)
  lobbies[lobbyId] = lobby
  lobby.addUser(user, true)

  return lobbies[lobbyId]
}

export function restart(oldLobby: Lobby, pubClient: RedisClient, subClient: RedisClient) {
  const lobbyId = makeid()
  const lobby = oldLobby.clone(lobbyId)
  connect(lobby, pubClient, subClient)
  lobbies[lobbyId] = lobby

  return lobbies[lobbyId]
}
