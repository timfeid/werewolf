import Joi from '@hapi/joi'
import { Lobbies } from '@werewolf/lobby'
import { Context } from 'koa'
import { cardConfiguration } from '../../../../werewolf/src'
import { DrunkCard } from '../../../../werewolf/src/cards/drunk'
import { InsomniacCard } from '../../../../werewolf/src/cards/insomniac'
import { RobberCard } from '../../../../werewolf/src/cards/robber'
import { SeerCard } from '../../../../werewolf/src/cards/seer'
import { TroublemakerCard } from '../../../../werewolf/src/cards/troublemaker'
import { WerewolfCard } from '../../../../werewolf/src/cards/werewolf'

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

    lobby.addUser(ctx.user)

    ctx.body = {
      data: lobby.toObject()
    }
  }

  public static async deal(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby.owner.user.id === ctx.user.id, 401)

    ctx.body = {
      data: lobby.deal()
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

  public static async getCard(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)

    ctx.body = {
      data: lobby.getOriginalCardForUserId(ctx.user.id)
    }
  }

  public static async turn(ctx: Context) {
    ctx.assert(ctx.user, 403)
    const lobby = Lobbies.get(ctx.params.id)
    ctx.assert(lobby, 404)
    const card = lobby.getOriginalCardForUserId(ctx.user.id)
    ctx.assert(card, 401)
    const currentTurn = lobby.currentTurn()
    ctx.assert(currentTurn, 401)
    ctx.assert(currentTurn.name === card.id, 401)

    switch (card.id) {
      case WerewolfCard.name:
        ctx.assert(ctx.request.body.view, 400)
        ctx.assert(ctx.request.body.view.match(/M[123]/), 400)
        if (ctx.request.body.view) {
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
          ctx.body = {
            data: lookups.map(lookup => lobby.getCard(lookup).toObject())
          }
        }
        break

      case RobberCard.name:
        ctx.assert(ctx.request.body.swap, 400)
        ctx.assert(ctx.request.body.swap.match(/P\d+/), 400)

        lobby.swapCards({
          type: 'player',
          index: lobby.users.findIndex(u => u.user.id === ctx.user.id)
        }, lobby.convertToCardPosition(ctx.request.body.swap))

        ctx.body = {
          data: lobby.getCardForUserId(ctx.user.id)
        }
        break

      case TroublemakerCard.name:
        ctx.assert(ctx.request.body.swap, 400)
        ctx.assert(ctx.request.body.swap.length === 2, 400)
        ctx.assert(ctx.request.body.swap[0].match(/P\d+/), 400)
        ctx.assert(ctx.request.body.swap[1].match(/P\d+/), 400)

        lobby.swapCards(lobby.convertToCardPosition(ctx.request.body.swap[0]), lobby.convertToCardPosition(ctx.request.body.swap[1]))

        ctx.body = {
          data: { success: true }
        }
        break

      case DrunkCard.name:
        ctx.assert(ctx.request.body.swap, 400)
        ctx.assert(ctx.request.body.swap.match(/M[123]/), 400)

        lobby.swapCards({
          type: 'player',
          index: lobby.users.findIndex(u => u.user.id === ctx.user.id)
        }, lobby.convertToCardPosition(ctx.request.body.swap))

        ctx.body = {
          data: { success: true }
        }
        break

      case InsomniacCard.name:
        ctx.body = {
          data: { card: lobby.getCardForUserId(ctx.user.id) }
        }
        break
    }
  }
}