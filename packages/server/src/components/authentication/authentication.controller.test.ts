import { hash } from 'bcrypt'
import { expect } from 'chai'
import faker from 'faker'
import { request } from '../../test/helpers'
import { check } from '../jwt/jwt.service'
import { User } from '../user/user.entity'
import userFactory from '../user/user.factory'

describe('authentication controller', () => {
  let user: User
  let password: string
  before(async () => {
    password = faker.internet.password()
    user = await userFactory()
    user.password = await hash(password, 10)
    await user.save()
  })

  it('cannot login with password mismatch', async () => {
    const response = await request('post', '/login', {
      data: {
        email: user.email,
        password: faker.internet.password(),
      }
    })

    expect(response.status).to.eq(401)
  })

  it('cannot login with invalid email', async () => {
    const response = await request('post', '/login', {
      data: {
        email: faker.internet.email(),
        password,
      }
    })

    expect(response.status).to.eq(401)
  })

  it('can login successfully', async () => {
    const response = await request('post', '/login', {
      data: {
        email: user.email,
        password,
      }
    })
    expect(response.status).to.eq(200)
    expect(check(response.body.token)).to.eq(true)
  })
})
