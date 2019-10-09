import { Context } from 'koa'
import { sign } from '../jwt/jwt.service'
import { UserService } from '../user/user.service'

export class AuthenticationController {
  public static async login (ctx: Context) {
    const user = await UserService.confirmLogin(ctx.request.body)

    ctx.assert(user, 401)

    ctx.body = {
      token: sign(user)
    }
  }
}
