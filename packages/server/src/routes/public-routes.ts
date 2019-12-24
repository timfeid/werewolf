import Router from 'koa-router'
import { AuthenticationController } from '../components/authentication/authentication.controller'

const publicRouter = new Router()

publicRouter.post('/login', AuthenticationController.login)
publicRouter.post('/register', AuthenticationController.register)

export { publicRouter }

