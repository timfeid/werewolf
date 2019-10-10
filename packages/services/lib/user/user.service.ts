import { config } from '@salem/config'
import { User } from '@salem/data'
import { compare, hash } from 'bcrypt'

export interface ConfirmLoginRequest {
  email: string;
  password: string;
}

export async function findUserByEmail(email: string) {
  return await User.findOne({email})
}

export async function confirmPassword(user: User, password: string) {
  return await compare(password, user.password)
}

export async function encryptPassword(password: string) {
  return await hash(password, config.crypt.bcryptRounds)
}

export async function confirmLogin({email, password}: ConfirmLoginRequest): Promise<User> {
  const user = await this.findUserByEmail(email)

  if (user && await this.confirmPassword(user, password)) {
    return user
  }
}

