import { User } from '@salem/data';
import { UserService } from '@salem/services';
import faker from 'faker';
import { Factory } from 'typeorm-factory';


export const UserFactory = new Factory(User)
  .sequence('email', () => faker.internet.email())
  // @ts-ignore
  .sequence('password', async () => {
    return await UserService.encryptPassword(faker.internet.password())
  })