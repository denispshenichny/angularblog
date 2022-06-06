export interface IUser {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface IFirebaseAuthResponse {
  token: string;
  expiresIn: number
}

export interface IFirebaseCreatePostResponse {
  name: string;
}

export interface IPost {
  id?: string;
  date: Date;
  title: string;
  content: string;
  author: string;
}
