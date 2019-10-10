import { SignOptions } from "jsonwebtoken";

export interface CryptConfig {
  bcryptRounds: number;
  jwtPrivateKey: string | Buffer;
  jwtPublicKey: string | Buffer;
  jwtSignOptions: SignOptions;
}