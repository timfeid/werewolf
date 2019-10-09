import { readFileSync } from 'fs'
import jwt from 'jsonwebtoken'
import { resolve } from 'path'
import { User } from '../user/user.entity'

export const publicKey = readFileSync(resolve(__dirname, '../../../../../resources/jwt-secret.key.pub'), 'utf8')
export const privateKey = readFileSync(resolve(__dirname, '../../../../../resources/jwt-secret.key'), 'utf8')

export function sign (user: User) {
  return jwt.sign({
    email: user.email,
    id: user.id
  }, privateKey, { algorithm: 'RS256' })
}

export function check (token: string) {
  try {
    jwt.verify(token, publicKey)
  } catch (e) {
    return false
  }

  return true
}