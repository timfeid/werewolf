import { createConnection } from '@salem/data'
import { Socket } from '@salem/socket'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import qs from 'koa-qs'
import { Resource } from './components/resource'
import { jwtMiddleware } from './middleware/jwt'
import { setupProtectedRoutes, setupPublicRoutes } from './routes'

const app = new Koa()
let socket: Socket

app.use(async (ctx, next) => {
  ctx.presence = socket
  try {
    await next()
  } catch (e) {
    if (e.name === 'ValidationError') {
      ctx.body = e.details
      ctx.status = 400
    } else if (e.status === 403) {
      ctx.body = { error: 'Forbidden.' }
      ctx.status = 403
    } else {
      ctx.body = { error: e.message }
      ctx.status = e.status || 500
      ctx.app.emit('error', e, ctx)
    }
  }
  if (ctx.body instanceof Resource) {
    ctx.body = ctx.body.toObject()
  }
})

app.use(bodyParser())
qs(app, 'extended')
app.use(setupPublicRoutes())
app.use(jwtMiddleware())
app.use(setupProtectedRoutes())

app.on('setPresence', (presence: Socket) => {
  socket = presence
})

createConnection().then(() => {
  app.emit('ready')
}).catch(e => {
  console.error(e)
  process.exit(-1)
})

export { app }

