import { Card } from './card'
import { DrunkCard } from './drunk'
import { InsomniacCard } from './insomniac'
import { MasonCard } from './mason'
import { MinionCard } from './minion'
import { RobberCard } from './robber'
import { SeerCard } from './seer'
import { TroublemakerCard } from './troublemaker'
import { VillagerCard } from './villager'
import { WerewolfCard } from './werewolf'

export interface CardConfiguration {
  card: typeof Card;
  max?: number;
  mustBe?: number;
}

// This should be in order of turn
const cardConfiguration: CardConfiguration[] = [
  {
    card: WerewolfCard,
    max: 2,
  },
  {
    card: MinionCard,
    max: 1,
  },
  {
    card: MasonCard,
    mustBe: 2,
    max: 2,
  },
  {
    card: SeerCard,
    max: 1,
  },
  {
    card: RobberCard,
    max: 1,
  },
  {
    card: TroublemakerCard,
    max: 1,
  },
  {
    card: DrunkCard,
    max: 1,
  },
  {
    card: InsomniacCard,
    max: 1,
  },
  {
    card: VillagerCard,
    max: 3,
  },
]

export { cardConfiguration }

