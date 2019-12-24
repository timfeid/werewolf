import dotenv from 'dotenv'
import path from 'path'
import { ConnectionOptions } from 'typeorm'
import { CryptConfig } from './interfaces'

dotenv.config({
  path: path.resolve(__dirname, '../../..', process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
})

export interface Config {
  database: ConnectionOptions;
  crypt: CryptConfig;
}

export const config: Config = {
  database: require('./database.config').database,
  crypt: require('./crypt.config').crypt,
}

