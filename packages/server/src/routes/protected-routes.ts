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
protectedRouter.post('/lobbies/:id/claim', LobbyController.claim)
protectedRouter.post('/lobbies/:id/vote', LobbyController.vote)
protectedRouter.post('/lobbies/:id/end', LobbyController.end)
protectedRouter.post('/lobbies/:id/restart', LobbyController.restart)

export { protectedRouter }

