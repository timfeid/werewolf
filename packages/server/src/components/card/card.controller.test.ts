import { cardConfiguration } from '@werewolf/werewolf'
import chai, { expect } from 'chai'
import subset from 'chai-subset'
import { request } from '../../test/helpers'

chai.use(subset)

describe('card controller', () => {

  it('can get /cards', async () => {
    const response = await request('get', '/cards')

    expect(response.status).to.eq(200)
    expect(response.body.data).to.containSubset(cardConfiguration.map(cc => {
      return {
        ...cc,
          // @ts-ignore
        card: (new cc.card()).toObject(),
      }
    }))
  })
})
