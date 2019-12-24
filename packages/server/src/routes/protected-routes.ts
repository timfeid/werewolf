import Router from 'koa-router'
import { LobbyController } from '../components/lobby/lobby.controller'
import { UserController } from '../components/user/user.controller'

const protectedRouter = new Router()

protectedRouter.get('/users', UserController.get)

protectedRouter.post('/lobbies', LobbyController.create)
protectedRouter.post('/lobbies/:id/join', LobbyController.join)
protectedRouter.post('/lobbies/:id/start', LobbyController.start)
protectedRouter.get('/lobbies/:id', LobbyController.get)

export { protectedRouter }

