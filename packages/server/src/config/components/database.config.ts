import joi from 'joi'
import path from 'path'
import { ConnectionOptions } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'

const envSchema = joi.object({
  DB_DRIVER: joi.string().valid('postgres', 'sqlite'),
  DB_HOSTNAME: joi.string().optional(),
  DB_USERNAME: joi.string().optional(),
  DB_DATABASE: joi.string().optional(),
  DB_PASSWORD: joi.string().optional(),
  DB_PORT: joi.number().optional(),
}).unknown().required()

const {error, value} = joi.validate(process.env, envSchema)

if (error) {
  throw error
}

interface DatabaseDrivers {
  postgres: PostgresConnectionOptions,
  sqlite: SqliteConnectionOptions,
}

const drivers: DatabaseDrivers = {
  postgres: {
    type: 'postgres',
    host: value.DB_HOSTNAME || 'localhost',
    port: parseInt(value.DB_PORT, 10) || 5432,
    database: value.DB_DATABASE || 'salem',
    username: value.DB_USERNAME || 'timfeid',
    password: value.DB_PASSWORD,
  },
  sqlite: {
    type: 'sqlite',
    database: value.DB_DATABASE || path.resolve(__dirname, '../../test/test.sqlite3'),
  },
}

// @ts-ignore
const database: ConnectionOptions = drivers[value.DB_DRIVER]

export { database }

