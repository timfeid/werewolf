import { compare } from 'bcrypt'
import { User } from './user.entity'

export interface ConfirmLoginRequest {
  email: string;
  password: string;
}

export class UserService {
  public static async findUserByEmail(email: string) {
    return await User.findOne({email})
  }

  public static async confirmPassword(user: User, password: string) {
    return await compare(password, user.password)
  }

  public static async confirmLogin({email, password}: ConfirmLoginRequest): Promise<User> {
    const user = await this.findUserByEmail(email)

    if (user && await this.confirmPassword(user, password)) {
      return user
    }
  }
}