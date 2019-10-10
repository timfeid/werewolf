import { createConnection } from '@salem/data'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import { jwtMiddleware } from './middleware/jwt'
import { setupProtectedRoutes, setupPublicRoutes } from './routes'

const app = new Koa()

app.use(bodyParser())
qs(app, 'extended')
app.use(setupPublicRoutes())
app.use(jwtMiddleware)
app.use(setupProtectedRoutes())

createConnection().then(() => {
  app.emit('ready')
}).catch(e => {
  console.error(e)
  process.exit(-1)
})

export { app }

