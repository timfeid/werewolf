import joi from 'joi'
import { ClientOpts } from 'redis'
import { validate } from './validate'

const value = validate(joi.object({
  REDIS_HOSTNAME: joi.string().optional(),
  REDIS_PORT: joi.number().optional(),
}).unknown().required())

const redis: ClientOpts = {
  host: value.REDIS_HOSTNAME || 'localhost',
  port: parseInt(value.REDIS_PORT, 10) || 6379
}

export { redis }

