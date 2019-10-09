import Router from 'koa-router'
import { UserController } from '../components/user/user.controller'

const protectedRouter = new Router()

protectedRouter.get('/user', UserController.get)

export { protectedRouter }

