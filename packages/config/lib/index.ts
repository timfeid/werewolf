import dotenv from 'dotenv'
import path from 'path'
import redis from 'redis'
import { CryptConfig } from './interfaces'

dotenv.config({
  path: path.resolve(__dirname, '../../..', process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
})

export interface Config {
  crypt: CryptConfig;
  redis: redis.ClientOpts;
}

export const config: Config = {
  crypt: require('./crypt.config').crypt,
  redis: require('./redis.config').redis,
}

