import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import { resolve } from 'path'
import { createConnection } from 'typeorm'
import { config } from './config'
import { jwtMiddleware } from './middleware/jwt'
import { setupProtectedRoutes, setupPublicRoutes } from './routes'

const app = new Koa()

app.use(bodyParser())
qs(app, 'extended')
app.use(setupPublicRoutes())
app.use(jwtMiddleware)
app.use(setupProtectedRoutes())

const db = createConnection({
  ...config.database,
  synchronize: true,
  entities: [
    resolve(__dirname, 'components/**/*.entity.js'),
    resolve(__dirname, 'components/**/*.entity.ts')
  ]
}).then(() => {
  app.emit('ready')
})

export { app, db }

