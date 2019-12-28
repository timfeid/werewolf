import Joi from '@hapi/joi'
import { JwtService } from '@werewolf/services'
import { Context } from 'koa'

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
