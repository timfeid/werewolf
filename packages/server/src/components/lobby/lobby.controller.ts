import { Lobbies } from '@salem/lobby'
import { Context } from 'koa'


export class LobbyController {
  public static async create(ctx: Context) {
    ctx.assert(ctx.user, 403)

    const lobby = Lobbies.create(ctx.user, ctx.presence)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async get(ctx: Context) {
    ctx.assert(ctx.user, 403)

    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async join(ctx: Context) {
    ctx.assert(ctx.user, 403)

    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)

    lobby.addUser(ctx.user)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async start(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    lobby.deal()

    ctx.body = {
      data: {
        success: true
      }
    }
  }
}
