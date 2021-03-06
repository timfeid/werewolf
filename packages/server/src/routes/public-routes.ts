import Router from 'koa-router'
import { AuthenticationController } from '../components/authentication/authentication.controller'
import { CardController } from '../components/card/card.controller'

const publicRouter = new Router()

publicRouter.post('/jwt', AuthenticationController.jwt)
publicRouter.get('/cards', CardController.list)

export { publicRouter }

