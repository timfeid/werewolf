import koaJwt from 'koa-jwt'
import { publicKey } from '../components/jwt/jwt.service'

const jwtMiddleware = koaJwt({
  secret: publicKey
})

export { jwtMiddleware }

