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

  public attach(server: Server, pubClient: RedisClient, subClient: RedisClient) {
    // eslint-disable-next-line
    // @ts-ignore
    this._io = socket(server, {
      handlePreflightRequest: cors(),
    })

    this.io.adapter(redisAdapter({
      pubClient,
      subClient,
    }))

    this.io.use(authorize())
    this.io.use(addEvents())

    this._presence = new Presence(pubClient)
  }

  public async findByUserId(userId: number): Promise<socket.Socket> {
    const sock = await this._presence.getSocketIdByUserId(userId)
    if (sock) {
      return this.io.sockets.sockets[sock.socketId]
    }
  }

}
