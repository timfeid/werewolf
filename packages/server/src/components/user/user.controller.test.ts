import { expect } from 'chai'
import { request } from '../../test/helpers'
import { sign } from '../jwt/jwt.service'
import { User } from '../user/user.entity'
import userFactory from '../user/user.factory'

describe('user controller', () => {
  let user: User
  before(async () => {
    user = await userFactory()
    await user.save()
  })

  it('can get /user', async () => {
    const response = await request('get', '/user', {
      token: sign(user)
    })

    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('email').eq(user.email)
    expect(response.body).to.have.property('id').eq(user.id)
    expect(response.body).to.not.have.property('password')
  })
})
