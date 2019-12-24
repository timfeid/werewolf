import { Context } from 'koa'
import { UserResource } from './user.resource'

export class UserController {
  public static async get (ctx: Context) {
    ctx.assert(ctx.user, 403)
    ctx.body = new UserResource(ctx.user)
  }
}
