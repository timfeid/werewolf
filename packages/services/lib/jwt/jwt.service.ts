import { config } from '@salem/config'
import { User } from '@salem/data'
import jwt from 'jsonwebtoken'

export function sign (user: User) {
  return jwt.sign({
    email: user.email,
    id: user.id
  }, config.crypt.jwtPrivateKey, config.crypt.jwtSignOptions)
}

export function check (token: string) {
  try {
    jwt.verify(token, config.crypt.jwtPublicKey)
  } catch (e) {
    return false
  }

  return true
}