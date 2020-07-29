import Router from 'koa-router'
import { AuthenticationController } from '../components/authentication/authentication.controller'
import { CardController } from '../components/card/card.controller'
import { NJDController } from '../components/njd/njd-controller'

const publicRouter = new Router()

publicRouter.post('/jwt', AuthenticationController.jwt)
publicRouter.get('/cards', CardController.list)


publicRouter.get('/ha.m3u8', NJDController.m3u8)
publicRouter.get('/m3u8/:id/:date', NJDController.getUrl)

export { publicRouter }

