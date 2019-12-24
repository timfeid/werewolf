import { User } from '@salem/data'
import { JwtService } from '@salem/services'
import supertest from 'supertest'
import { app } from '../app'

interface RequestSettings {
  token?: string;
  user?: User;
  data?: object;
}

export async function request (method: 'get' | 'post' | 'put' | 'delete' | 'patch', uri: string, options: RequestSettings = {}): Promise<supertest.Response> {
  const request = supertest(app.callback())[method](uri)
  let { data, user, token } = options

  if (data) {
    // console.log(data)
    request.send(data)
      .type('json')
      .set('Accept', 'application/json')
  }
  if (user && !token) {
    token = await JwtService.sign(user)
  }

  if (token) {
    request.set('Authorization', `Bearer ${token}`)
  }

  return request
}
