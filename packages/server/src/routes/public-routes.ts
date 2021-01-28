import Router from 'koa-router'
import { AuthenticationController } from '../components/authentication/authentication.controller'
import { CardController } from '../components/card/card.controller'
import { NJDController } from '../components/njd/njd-controller'

const publicRouter = new Router()

publicRouter.post('/jwt', AuthenticationController.jwt)
publicRouter.get('/cards', CardController.list)


publicRouter.get('/ha.m3u8', NJDController.m3u8)
publicRouter.get('/get-key', NJDController.getKey)
publicRouter.get('/m3u8/:id', NJDController.getUrl)
publicRouter.get('/trick', NJDController.getTrickedUrl)
publicRouter.get('/proxy', NJDController.proxy)
publicRouter.get('/card/:homeId/:awayId', NJDController.getImage)
publicRouter.get('/bg/:homeId/:awayId', NJDController.getBackground)

export { publicRouter }

