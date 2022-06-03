export interface IUser {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface IFirebaseAuthResponse {
  token: string;
  expiresIn: number
}

export interface IPost {
  id?: number;
  date: Date;
  title: string;
  content: string;
  author: string;
}
