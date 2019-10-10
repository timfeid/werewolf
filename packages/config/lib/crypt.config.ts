import { readFileSync } from 'fs'
import joi from 'joi'
import { resolve } from 'path'
import { CryptConfig } from './interfaces'
import { validate } from './validate'

const values = validate(joi.object({
  BCRYPT_ROUNDS: joi.number().optional(),
  JWT_PUBLIC_KEY: joi.string().optional(),
  JWT_PRIVATE_KEY: joi.string().optional(),
  JWT_KEY: joi.string().optional(),
  JWT_TYPE: joi.string().optional(),
}).unknown().required())

const usesAlgorithm = values.JWT_PRIVATE_KEY && values.JWT_PUBLIC_KEY

if (usesAlgorithm) {
  if (values.JWT_PRIVATE_KEY.substr(0, 2) !== '/') {
    values.JWT_PRIVATE_KEY = resolve('../..', values.JWT_PRIVATE_KEY)
  }
  if (values.JWT_PUBLIC_KEY.substr(0, 2) !== '/') {
    values.JWT_PUBLIC_KEY = resolve('../..', values.JWT_PUBLIC_KEY)
  }
}

const crypt: CryptConfig = {
  bcryptRounds: parseInt(values.BCRYPT_ROUNDS, 10) || 15,
  jwtPrivateKey: usesAlgorithm ? readFileSync(values.JWT_PRIVATE_KEY, 'utf8') : (values.JWT_KEY || 'sadface'),
  jwtPublicKey: usesAlgorithm ? readFileSync(values.JWT_PUBLIC_KEY, 'utf8') : (values.JWT_KEY || 'sadface'),
  jwtSignOptions: usesAlgorithm ? { algorithm: 'RS256' } : {}
}

export { crypt }

