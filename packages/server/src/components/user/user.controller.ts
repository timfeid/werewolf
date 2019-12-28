import { Context } from 'koa'
import { UserResource } from './user.resource'

export class UserController {
  public static async get (ctx: Context) {
    ctx.assert(ctx.user.id, 403)
    ctx.body = new UserResource(ctx.user)
  }
}
