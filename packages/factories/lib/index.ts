import { User } from '@werewolf/data'
import { encryptPassword } from '@werewolf/users'
import faker from 'faker'
import { Factory } from 'typeorm-factory'


export const UserFactory = new Factory(User)
  .sequence('email', () => faker.internet.email())
  .sequence('name', () => faker.name.firstName())
  // @ts-ignore
  .sequence('password', async () => {
    return await encryptPassword(faker.internet.password())
  })
