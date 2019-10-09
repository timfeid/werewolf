import dotenv from 'dotenv'
import path from 'path'
import { ConnectionOptions } from 'typeorm'

dotenv.config({
  path: path.resolve(__dirname, '../../../..', process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
})

interface Config {
  database: ConnectionOptions
}

const config: Config = {
  database: require('./components/database.config').database,
}

export { config }

