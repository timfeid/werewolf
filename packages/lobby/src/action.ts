import { LobbyUser } from './user'
import { CardPosition } from './lobby'
import { Card } from '@werewolf/werewolf/src'

export class ActionWhat {
  position: CardPosition
  card: Card
}

export class Action {
  who: LobbyUser
  action: string
  whats: ActionWhat[]
  currentCard: {
    name: string;
    description: string;
    id: string;
    turnLength: number;
    isWerewolf: boolean;
    winsWith: string;
  }
  constructor (who: LobbyUser, action: string, what: ActionWhat[]) {
    this.who = who
    this.currentCard = who.card.toObject()
    this.action = action
    this.whats = what
  }
}
