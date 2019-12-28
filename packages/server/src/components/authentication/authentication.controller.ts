import Joi from '@hapi/joi'
import { User } from '@werewolf/data'
import { JwtService } from '@werewolf/services'
import * as UserService from '@werewolf/users'
import { Context } from 'koa'
import { UserResource } from '../user/user.resource'

function makeid() {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ346789'
  const charactersLength = characters.length
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

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

  public static async jwt (ctx: Context) {
    const validator = Joi.object({
      name: Joi.string().required().allow(''),
      id: Joi.string().optional(),
    }).validate(ctx.request.body)

    if (validator.error) {
      throw validator.error
    }

    const jwt = JwtService.sign({
      id: validator.value.id || makeid(),
      name: validator.value.name,
    })

    ctx.body = {
      data: {
        jwt
      }
    }
  }
}
