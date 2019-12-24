import { protectedRouter } from './protected-routes'
import { publicRouter } from './public-routes'

export function setupProtectedRoutes() {
  return protectedRouter.routes()
}

export function setupPublicRoutes() {
  return publicRouter.routes()
}
