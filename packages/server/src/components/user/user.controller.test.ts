import { User } from '@salem/data'
import { UserFactory } from '@salem/factories'
import { JwtService } from '@salem/services'
import { expect } from 'chai'
import { request } from '../../test/helpers'

describe('user controller', () => {
  let user: User
  before(async () => {
    user = await UserFactory.create()
    await user.save()
  })

  it('can get /user', async () => {
    const response = await request('get', '/user', {
      token: JwtService.sign(user)
    })

    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('email').eq(user.email)
    expect(response.body).to.have.property('id').eq(user.id)
    expect(response.body).to.not.have.property('password')
  })
})
