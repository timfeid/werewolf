import { config } from '@salem/config'
import koaJwt from 'koa-jwt'

const jwtMiddleware = koaJwt({
  secret: config.crypt.jwtPublicKey
})

export { jwtMiddleware }

