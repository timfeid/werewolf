import { JwtService, UserService } from '@salem/services'
import { Context } from 'koa'

export class AuthenticationController {
  public static async login (ctx: Context) {
    const user = await UserService.confirmLogin(ctx.request.body)

    ctx.assert(user, 401)

    ctx.body = {
      token: JwtService.sign(user)
    }
  }
}
