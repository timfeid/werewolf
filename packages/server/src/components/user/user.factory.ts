import bcrypt from 'bcrypt'
import faker from 'faker'
import { User } from './user.entity'

export default async () => {
  const user = new User()
  user.email = faker.internet.email()
  user.password = await bcrypt.hash(faker.internet.password(), 10)

  return user
}
