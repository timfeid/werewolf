import { cardConfiguration } from '@werewolf/werewolf'
import { Context } from 'koa'


export class CardController {
  public static async list (ctx: Context) {
    ctx.body = {
      data: cardConfiguration.map(cc => {
        return {
          ...cc,
          // @ts-ignore
          card: (new cc.card()).toObject(),
        }
      })
    }
  }
}
