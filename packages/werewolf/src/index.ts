import { cardConfiguration } from './cards'
import { Card } from './cards/card'
import { Werewolf } from './werewolf'

export { Card, Werewolf }
export { cardConfiguration }

export interface User {
  id: string;
  name: string;
}
