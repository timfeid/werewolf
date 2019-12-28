import { expect } from 'chai'
import { MasonCard } from './cards/mason'
import { SeerCard } from './cards/seer'
import { VillagerCard } from './cards/villager'
import { WerewolfCard } from './cards/werewolf'
import { NotEnoughPlayers, NoWerewolves, TooMany, Werewolf, WrongCardCount } from './werewolf'

describe('werewolf deck validation', () => {
  it('has a valid deck', () => {
    const validation = Werewolf.hasValidCards([
      new WerewolfCard(),
      new SeerCard(),
      new MasonCard(),
      new MasonCard(),
      new VillagerCard(),
      new VillagerCard(),
    ], 3)

    expect(validation.valid).to.eq(true)
  })

  it('card count needs to be player count + 3', () => {
    const validation = Werewolf.hasValidCards([
      new WerewolfCard(),
      new SeerCard(),
      new SeerCard(),
      new MasonCard(),
      new MasonCard(),
    ], 3)

    expect(validation.valid).to.eq(false)
    expect(validation.errors[0]).instanceOf(WrongCardCount)
  })

  it('minimum of 3 players', () => {
    const validation = Werewolf.hasValidCards([
      new WerewolfCard(),
      new SeerCard(),
      new SeerCard(),
      new MasonCard(),
      new MasonCard(),
    ], 2)

    expect(validation.valid).to.eq(false)
    expect(validation.errors[0]).instanceOf(NotEnoughPlayers)
  })

  it('has too many seer cards', () => {
    const validation = Werewolf.hasValidCards([
      new WerewolfCard(),
      new SeerCard(),
      new SeerCard(),
      new MasonCard(),
      new MasonCard(),
      new VillagerCard(),
    ], 3)

    expect(validation.valid).to.eq(false)
    expect(validation.errors[0]).instanceOf(TooMany)
  })

  it('has no werewolf', () => {
    const validation = Werewolf.hasValidCards([
      new MasonCard(),
      new VillagerCard(),
      new VillagerCard(),
      new MasonCard(),
      new SeerCard(),
      new VillagerCard(),
    ], 3)

    expect(validation.valid).to.eq(false)
    expect(validation.errors[0]).instanceOf(NoWerewolves)
  })
})
