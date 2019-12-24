import { Server } from 'http'
import { RedisClient } from 'redis'
import socket from 'socket.io'
import redisAdapter from 'socket.io-redis'
import cors from './cors'
import addEvents from './middleware/add-events'
import authorize from './middleware/authorize'
import { Presence } from './presence'

export class Socket {

  private _io: socket.Server;
  private _presence: Presence

  public get io(): socket.Server {
    return this._io
  }

  public get presence(): Presence {
    return this._presence
  }

  public attach(server: Server, redisClient: RedisClient) {
    this._io = socket(server, {
      // eslint-disable-next-line
      // @ts-ignore this is a real thing tho..
      handlePreflightRequest: cors(),
      adapter: redisAdapter({
        pubClient: redisClient,
        subClient: redisClient,
      }),
    })

    this.io.use(authorize())
    this.io.use(addEvents())

    this._presence = new Presence(redisClient)
  }

  public async findByUserId(userId: number): Promise<socket.Socket> {
    const sock = await this._presence.getSocketIdByUserId(userId)
    if (sock) {
      return this.io.sockets.sockets[sock.socketId]
    }
  }

}
