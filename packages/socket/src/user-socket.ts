import { User } from '@werewolf/werewolf'
import io from 'socket.io'

export interface UserSocket extends io.Socket {
  user?: User;
}
