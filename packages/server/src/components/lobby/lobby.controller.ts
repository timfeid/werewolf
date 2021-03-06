import Joi from '@hapi/joi'
import { Lobbies } from '@werewolf/lobby'
import { Context } from 'koa'
import { cardConfiguration } from '../../../../werewolf/src'
import { CopycatCard } from '../../../../werewolf/src/cards/copycat'
import { DoppelgangerCard } from '../../../../werewolf/src/cards/doppelganger'
import { DrunkCard } from '../../../../werewolf/src/cards/drunk'
import { InsomniacCard } from '../../../../werewolf/src/cards/insomniac'
import { MysticWolfCard } from '../../../../werewolf/src/cards/mystic-wolf'
import { RobberCard } from '../../../../werewolf/src/cards/robber'
import { SeerCard } from '../../../../werewolf/src/cards/seer'
import { TroublemakerCard } from '../../../../werewolf/src/cards/troublemaker'
import { WerewolfCard } from '../../../../werewolf/src/cards/werewolf'
import { AssassinCard } from '../../../../werewolf/src/cards/assassin'

export class LobbyController {
  public static async create(ctx: Context) {
    ctx.assert(ctx.user, 403)

    const lobby = Lobbies.create(ctx.user, ctx.redisPubClient, ctx.redisSubClient)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async get(ctx: Context) {
    ctx.assert(ctx.user, 403)

    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async join(ctx: Context) {
    ctx.assert(ctx.user, 403)

    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)

    ctx.assert(lobby.addUser(ctx.user, lobby.users.length === 0), 400)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async deal(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    const data = lobby.deal()

    ctx.status = data.success ? 200 : 400
    ctx.body = {
      data,
    }
  }

  public static async updateCards(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    const validator = Joi.object({
      cards: Joi.array().items(Joi.string().allow(cardConfiguration.map(c => c.card.name)))
    }).validate(ctx.request.body)

    if (validator.error) {
      throw validator.error
    }

    lobby.setCards(validator.value.cards)

    ctx.body = {
      data: {
        success: true
      }
    }
  }

  public static async start(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    ctx.body = {
      data: lobby.start()
    }
  }

  public static async end(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    ctx.body = {
      data: lobby.end()
    }
  }

  public static async getCard(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)

    ctx.body = {
      data: lobby.getOriginalCardObjectForUserId(ctx.user.id)
    }
  }

  public static async claim(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(ctx.request.body.id, 400)

    const claim = lobby.setClaim(ctx.user.id, ctx.request.body.id)

    ctx.body = {
      data: {
        success: claim !== false
      }
    }
  }

  public static async vote(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(ctx.request.body.id, 400)
    ctx.assert(lobby, 404)

    const claim = lobby.setVote(ctx.user.id, ctx.request.body.id)

    ctx.body = {
      data: {
        success: claim !== false
      }
    }
  }

  public static async restart(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    ctx.body = {
      data: Lobbies.restart(lobby, ctx.redisPubClient, ctx.redisSubClient)
    }
  }

  public static async turn(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)
    const card = lobby.getOriginalCardObjectForUserId(ctx.user.id)
    const user = lobby.users.find(u => u.user.id === ctx.user.id)
    ctx.assert(card, 401)
    const currentTurn = lobby.currentTurn()
    ctx.assert(currentTurn, 401)
    ctx.assert(currentTurn.name === card.id || (card.isWerewolf && currentTurn.name === WerewolfCard.name) || (card.id === CopycatCard.name && user.copycat && currentTurn.name === user.copycat.constructor.name), 401)
    const currentTurnName = (currentTurn.name === DoppelgangerCard.name && user.doppelganger) ? user.doppelganger.constructor.name : currentTurn.name

    switch (currentTurnName) {
      case CopycatCard.name:
        ctx.assert(ctx.request.body.view, 400)
        ctx.assert(ctx.request.body.view.match(/M[123]+/), 400)

        if (ctx.request.body.view) {
          lobby.addAction(ctx.user.id, 'copycated', [ctx.request.body.view])
          ctx.body = {
            data: lobby.copycat(ctx.user.id, ctx.request.body.view),
          }
        }
        break

      case DoppelgangerCard.name:
        ctx.assert(ctx.request.body.view, 400)
        ctx.assert(ctx.request.body.view.match(/P\d+/), 400)

        if (ctx.request.body.view) {
          lobby.addAction(ctx.user.id, 'doppelgangged', [ctx.request.body.view])
          ctx.body = {
            data: lobby.doppelganger(ctx.user.id, ctx.request.body.view),
          }
        }
        break

      case WerewolfCard.name:
        ctx.assert(ctx.request.body.view, 400)
        ctx.assert(ctx.request.body.view.match(/M[123]/), 400)
        if (ctx.request.body.view) {
          lobby.addAction(ctx.user.id, 'viewed', [ctx.request.body.view])
          ctx.body = {
            data: lobby.getCard(ctx.request.body.view).toObject()
          }
        }
        break

      case SeerCard.name:
        ctx.assert(ctx.request.body.view, 400)
        ctx.assert(ctx.request.body.view[0], 400)
        const lookups = []
        if (ctx.request.body.view[0].match(/M[123]/)) {
          ctx.assert(ctx.request.body.view[1], 400)
          ctx.assert(ctx.request.body.view[1].match(/M[123]/), 400)
          lookups.push(ctx.request.body.view[0])
          lookups.push(ctx.request.body.view[1])
        } else if (ctx.request.body.view[0].match(/P\d+/)) {
          lookups.push(ctx.request.body.view[0])
        }

        ctx.assert(lookups.length > 0, 400)

        if (ctx.request.body.view) {
          lobby.addAction(ctx.user.id, 'viewed', lookups)
          ctx.body = {
            data: lookups.map(lookup => {
              return {
                ...lobby.getCard(lookup).toObject(),
                position: lookup,
              }
            })
          }
        }
        break

      case MysticWolfCard.name:
        ctx.assert(ctx.request.body.view, 400)
        ctx.assert(ctx.request.body.view.match(/P\d+/), 400)

        if (ctx.request.body.view) {
          lobby.addAction(ctx.user.id, 'viewed', [ctx.request.body.view])
          ctx.body = {
            data: lobby.getCard(ctx.request.body.view).toObject(),
          }
        }
        break

      case RobberCard.name:
        ctx.assert(ctx.request.body.swap, 400)
        ctx.assert(ctx.request.body.swap.match(/P\d+/), 400)

        lobby.addAction(ctx.user.id, 'swapped with', [ctx.request.body.swap])
        lobby.swapCards({
          type: 'player',
          index: lobby.users.findIndex(u => u.user.id === ctx.user.id)
        }, lobby.convertToCardPosition(ctx.request.body.swap))

        ctx.body = {
          data: lobby.getCardObjectForUserId(ctx.user.id)
        }
        break

      case AssassinCard.name:
        ctx.assert(ctx.request.body.mark, 400)
        ctx.assert(ctx.request.body.mark.match(/P\d+/), 400)

        lobby.addAction(ctx.user.id, 'placed mark of assassin on', [ctx.request.body.mark])
        lobby.markOfAssassin(lobby.convertToCardPosition(ctx.request.body.mark))

        ctx.body = {
          data: {success: true}
        }
        break

      case TroublemakerCard.name:
        ctx.assert(ctx.request.body.swap, 400)
        ctx.assert(ctx.request.body.swap.length === 2, 400)
        ctx.assert(ctx.request.body.swap[0].match(/P\d+/), 400)
        ctx.assert(ctx.request.body.swap[1].match(/P\d+/), 400)
        lobby.addAction(ctx.user.id, 'swapped', ctx.request.body.swap)
        lobby.swapCards(lobby.convertToCardPosition(ctx.request.body.swap[0]), lobby.convertToCardPosition(ctx.request.body.swap[1]))

        ctx.body = {
          data: { success: true }
        }
        break

      case DrunkCard.name:
        ctx.assert(ctx.request.body.swap, 400)
        ctx.assert(ctx.request.body.swap.match(/M[123]/), 400)

        lobby.addAction(ctx.user.id, 'swapped with', [ctx.request.body.swap])
        lobby.swapCards({
          type: 'player',
          index: lobby.users.findIndex(u => u.user.id === ctx.user.id)
        }, lobby.convertToCardPosition(ctx.request.body.swap))

        ctx.body = {
          data: { success: true }
        }
        break

      case InsomniacCard.name:
        lobby.addAction(ctx.user.id, 'viewed his/her card', [])
        ctx.body = {
          data: { card: lobby.getCardObjectForUserId(ctx.user.id) }
        }
        break
    }
  }
}
