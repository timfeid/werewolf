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

  it('not logged in /users', async () => {
    const response = await request('get', '/users')

    expect(response.status).to.eq(403)
  })

  it('can get /users', async () => {
    const response = await request('get', '/users', {
      token: JwtService.sign(user),
    })

    expect(response.status).to.eq(200)
    expect(response.body.data).to.have.property('email').eq(user.email)
    expect(response.body.data).to.have.property('id').eq(user.id)
    expect(response.body.data).to.not.have.property('password')
  })
})
