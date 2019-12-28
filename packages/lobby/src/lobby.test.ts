import { expect } from 'chai'
import { MinionCard } from '../../werewolf/src/cards/minion'
import { VillagerCard } from '../../werewolf/src/cards/villager'
import { WerewolfCard } from '../../werewolf/src/cards/werewolf'
import { Lobby } from './lobby'


function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

describe('lobby', () => {
  let lobby: Lobby

  it('can create a lobby', async () => {
    const user = {id: 'asdf', name: 'wat'}
    const lobby = new Lobby('random')
    lobby.addUser(user, true)

    expect(lobby.owner.user).to.have.property('id').eq(user.id)
  })

  it('can start with valid cards + players', async () => {
    const owner = {id: 'laskdmsjndbf', name: 'owner'}
    const users = [{ id: 'sdaf', name: 'user1' }, { id: 'sdax', name: 'user2' }]
    const lobby = new Lobby('random')
    lobby.addUser(owner, true)

    users.forEach(lobby.addUser.bind(lobby))

    lobby.setCards([
      WerewolfCard.name,
      WerewolfCard.name,
      MinionCard.name,
      VillagerCard.name,
      VillagerCard.name,
      VillagerCard.name,
    ])

    expect(lobby.isValid).to.eq(true)
  })

  it('starts the game correctly', async () => {
    const owner = { id: 'laskdmsjndbf', name: 'owner' }
    const users = [{ id: 'sdaf', name: 'user1' }, { id: 'sdax', name: 'user2' }]
    lobby = new Lobby('random')
    lobby.addUser(owner, true)

    users.forEach(lobby.addUser.bind(lobby))

    lobby.setCards([
      WerewolfCard.name,
      WerewolfCard.name,
      MinionCard.name,
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
