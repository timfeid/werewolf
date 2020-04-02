import { Card } from './card'
import { CopycatCard } from './copycat'
import { DoppelgangerCard } from './doppelganger'
import { DrunkCard } from './drunk'
import { InsomniacCard } from './insomniac'
import { MasonCard } from './mason'
import { MinionCard } from './minion'
import { MysticWolfCard } from './mystic-wolf'
import { RobberCard } from './robber'
import { SeerCard } from './seer'
import { TroublemakerCard } from './troublemaker'
import { VillagerCard } from './villager'
import { WerewolfCard } from './werewolf'
import { SquireCard } from './squire'
import { AssassinCard } from './assassin'

export interface CardConfiguration {
  card: typeof Card;
  max?: number;
  mustBe?: number;
}

// This should be in order of turn
const cardConfiguration: CardConfiguration[] = [
  {
    card: CopycatCard,
    max: 1,
  },
  {
    card: DoppelgangerCard,
    max: 1,
  },
  {
    card: AssassinCard,
    max: 1,
  },
  {
    card: WerewolfCard,
    max: 2,
  },
  {
    card: MysticWolfCard,
    max: 1,
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
    card: SquireCard,
    max: 1,
  },
  {
    card: VillagerCard,
    max: 3,
  },
]

export { cardConfiguration }

