import { Context } from "koa"

export class UserController {
  public static async get (ctx: Context) {
    ctx.body = ctx.state.user
  }
}
