import { config } from '@salem/config'
import { User } from '@salem/data'
import jwt from 'jsonwebtoken'

export function decode(token: string) {
  return jwt.decode(token)
}

export function sign (user: User) {
  return jwt.sign({
    email: user.email,
    name: user.name,
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

export async function getUser(token: string) {
  const details = check(token) ? jwt.decode(token) as any : false
  if (details !== false) {
    return User.findOne(details.id)
  }
}

export function extractTokenFromHeader(authorizationHeader: string) {
  if (authorizationHeader && authorizationHeader.indexOf('Bearer ') !== -1) {
    return authorizationHeader.split('Bearer ')[1]
  }

  return ''
}

export function getUserFromHeader(authorizationHeader: string) {
  return getUser(extractTokenFromHeader(authorizationHeader))
}
