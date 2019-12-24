import { config } from '@salem/config'
import { resolve } from 'path'
import { createConnection as cc } from 'typeorm'
import { User } from './entities/user.entity'

function createConnection() {
  return cc({
    ...config.database,
    synchronize: true,
    entities: [
      resolve(__dirname, 'entities/**/*.entity.js'),
      resolve(__dirname, 'entities/**/*.entity.ts')
    ]
  })
}

export { User, createConnection }

