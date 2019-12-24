import { User } from '@salem/data'
import { JwtService } from '@salem/services'
import koa from 'koa'

export function jwtMiddleware(): koa.Middleware {
  return async (ctx, next) => {
    ctx.jwt = JwtService.decode(
      JwtService.extractTokenFromHeader(ctx.headers.authorization)
    ) || {}

    ctx.user = ctx.jwt.id ? User.create(ctx.jwt) : undefined

    await next()
  }
}
