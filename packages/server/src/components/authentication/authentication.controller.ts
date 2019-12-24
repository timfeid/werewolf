import Joi from '@hapi/joi'
import { User } from '@salem/data'
import { JwtService } from '@salem/services'
import * as UserService from '@salem/users'
import { Context } from 'koa'
import { UserResource } from '../user/user.resource'

export class AuthenticationController {
  public static async login (ctx: Context) {
    const user = await UserService.confirmLogin(ctx.request.body)

    ctx.assert(user, 401)

    ctx.body = {
      data: {
        token: JwtService.sign(user)
      }
    }
  }

  public static async register (ctx: Context) {
    const validator = Joi.object({
      email: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required().equal(ctx.request.body.password),
    }).validate(ctx.request.body)

    if (validator.error) {
      throw validator.error
    }

    const user = await User.create({
      email: validator.value.email,
      password: await UserService.encryptPassword(validator.value.password),
      name: validator.value.name,
    }).save()

    ctx.body = new UserResource(user)
  }
}
