import { User } from '@salem/data'
import { UserFactory } from '@salem/factories'
import { hash } from 'bcrypt'
import { expect } from 'chai'
import faker from 'faker'
import { JwtService } from '../../../../services/lib'
import { request } from '../../test/helpers'

describe('authentication controller', () => {
  let user: User
  let password: string
  before(async () => {
    password = faker.internet.password()
    user = await UserFactory.create()
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
    expect(JwtService.check(response.body.token)).to.eq(true)
  })
})
