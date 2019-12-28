// types.ts
export interface UserState {
  jwt: string;
  decoded: { [key: string]: any };
}
