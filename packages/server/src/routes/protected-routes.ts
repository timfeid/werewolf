import Router from 'koa-router'
import { LobbyController } from '../components/lobby/lobby.controller'

const protectedRouter = new Router()

protectedRouter.post('/lobbies', LobbyController.create)
protectedRouter.post('/lobbies/:id/join', LobbyController.join)
protectedRouter.post('/lobbies/:id/deal', LobbyController.deal)
protectedRouter.put('/lobbies/:id/cards', LobbyController.updateCards)
protectedRouter.post('/lobbies/:id/start', LobbyController.start)
protectedRouter.get('/lobbies/:id', LobbyController.get)
protectedRouter.get('/lobbies/:id/card', LobbyController.getCard)
protectedRouter.post('/lobbies/:id/turn', LobbyController.turn)

export { protectedRouter }

