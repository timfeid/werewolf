import { User } from '@salem/data'
import { Socket } from '@salem/socket'
import { Lobby } from '.'

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

export function create(user: User, presence: Socket) {
  const lobbyId = makeid()

  lobbies[lobbyId] = new Lobby(user, lobbyId, presence)

  return lobbies[lobbyId]
}
