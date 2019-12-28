import { expect } from 'chai'
import { JwtService } from '../../../../services/lib'
import { request } from '../../test/helpers'

describe('authentication controller', () => {

  it('can create jwt from name', async () => {
    const response = await request('post', '/jwt', {
      data: {
        name: 'bob',
      }
    })
    expect(response.status).to.eq(200)
    expect(response.body.data).to.have.property('jwt').not.null
  })

  it('can create jwt from name but keep id', async () => {
    const id = 'TESTARINO'
    const response = await request('post', '/jwt', {
      data: {
        name: 'hello',
        id,
      }
    })
    expect(response.status).to.eq(200)
    expect(response.body.data).to.have.property('jwt').not.null
    expect((JwtService.decode(response.body.data.jwt) as any).id).to.eq(id)
  })
})
