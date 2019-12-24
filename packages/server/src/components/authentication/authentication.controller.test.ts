import { User } from '@salem/data'
import { UserFactory } from '@salem/factories'
import { hash } from 'bcryptjs'
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
    expect(JwtService.check(response.body.data.token)).to.eq(true)
  })

  it('can create user', async () => {
    const user = UserFactory.build()
    const pw = faker.lorem.word()
    const response = await request('post', '/register', {
      data: {
        email: user.email,
        password: pw,
        confirmPassword: pw,
        name: user.name,
      }
    })
    expect(response.status).to.eq(200)
    const r = expect(response.body.data)

    r.to.have.property('email').eq(user.email)
    r.to.have.property('id').not.null
    expect(await User.find(response.body.data.id)).to.not.be.null
  })
})
