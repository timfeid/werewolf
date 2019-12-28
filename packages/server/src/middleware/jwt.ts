import { JwtService } from '@werewolf/services'
import koa from 'koa'

export function jwtMiddleware(): koa.Middleware {
  return async (ctx, next) => {
    ctx.jwt = JwtService.decode(
      JwtService.extractTokenFromHeader(ctx.headers.authorization)
    ) || {}

    ctx.user = ctx.jwt

    await next()
  }
}
