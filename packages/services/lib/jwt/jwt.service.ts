import { config } from '@werewolf/config'
import jwt from 'jsonwebtoken'

export function decode(token: string) {
  return jwt.decode(token)
}

export function sign (user: {name: string; id: string | number}) {
  return jwt.sign({
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
    return details
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
