export interface IUser {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface IFirebaseAuthResponse {
  token: string;
  expiresIn: number
}
