import { createConnection } from '@salem/data'
import { UserFactory } from '@salem/factories'
import { expect } from 'chai'
import { VillagerCard } from '../../werewolf/src/cards/villager'
import { WerewolfCard } from '../../werewolf/src/cards/werewolf'
import { Lobby } from './lobby'


function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

describe('lobby', () => {
  let lobby: Lobby
  before (async () => {
    await createConnection()
  })

  it('can create a lobby', async () => {
    const user = await UserFactory.create()
    const lobby = new Lobby(user)

    expect(lobby.owner.user).to.have.property('id').eq(user.id)
  })

  it('can start with valid cards + players', async () => {
    const owner = await UserFactory.create()
    const users = await UserFactory.createList(2)
    const lobby = new Lobby(owner)

    users.forEach(lobby.addUser.bind(lobby))

    lobby.setDeck([
      WerewolfCard.name,
      WerewolfCard.name,
      VillagerCard.name,
      VillagerCard.name,
      VillagerCard.name,
      VillagerCard.name,
    ])

    expect(lobby.isStartable).to.eq(true)
  })

  it('starts the game correctly', async () => {
    const owner = await UserFactory.create()
    const users = await UserFactory.createList(2)
    lobby = new Lobby(owner)

    users.forEach(lobby.addUser.bind(lobby))

    lobby.setDeck([
      WerewolfCard.name,
      WerewolfCard.name,
      VillagerCard.name,
      VillagerCard.name,
      VillagerCard.name,
      VillagerCard.name,
    ])

    lobby.on('dealt', () => {
      // console.log(lobby)
    })

    lobby.deal()
  })

  it('can swap da cards with the middle', async () => {
    const myIndex = random(3)
    const myCard = lobby.getPlayerCard(myIndex).name

    const middleIndex = random(3)
    const middleCard = lobby.getMiddleCard(middleIndex).name

    lobby.swapCards({
      type: 'player',
      index: myIndex,
    }, {
      type: 'middle',
      index: middleIndex,
    })

    expect(lobby.getPlayerCard(myIndex).name).to.eq(middleCard)
    expect(lobby.getMiddleCard(middleIndex).name).to.eq(myCard)
  })

  it('can swap da cards with the another player', async () => {
    const myIndex = random(3)
    const myCard = lobby.getPlayerCard(myIndex).name

    const theirIndex = myIndex === 0 ? 1 : 0
    const theirCard = lobby.getPlayerCard(theirIndex).name

    lobby.swapCards({
      type: 'player',
      index: myIndex,
    }, {
      type: 'player',
      index: theirIndex,
    })

    expect(lobby.getPlayerCard(myIndex).name).to.eq(theirCard)
    expect(lobby.getPlayerCard(theirIndex).name).to.eq(myCard)
  })

  it('can look at a card in the middle', async () => {
    const middleIndex = random(3)

    expect(lobby.getMiddleCard(middleIndex)).to.eq(lobby.middle[middleIndex])
  })

  it('can look at a card a player has', async () => {
    const playerIndex = random(3)

    expect(lobby.getPlayerCard(playerIndex)).to.eq(lobby.users[playerIndex].card)
  })

  it('can look at a card', async () => {
    const type = random(2) === 1 ? 'player' : 'middle'
    const index = random(3)

    expect(lobby.getCard({
      type,
      index,
    })).to.eq(type === 'player' ? lobby.users[index].card : lobby.middle[index])
  })

  it('can find users with a specific card', () => {
    const cardId = WerewolfCard.name

    const playerCards = lobby.findPlayersWithCard(cardId)

    expect(playerCards.map(u => u.user.id)).to.eql(lobby.users.filter(u => u.card.constructor.name === cardId).map(u => u.user.id))

    const middleWerewolves = lobby.middle.filter(c => c.constructor.name === cardId).length
    expect(playerCards.length).to.eq(2 - middleWerewolves)
  })

})
