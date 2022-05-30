import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IFirebaseAuthResponse, IUser} from "../interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  get token() : string {
    const expirationDate = localStorage.getItem('fbTokenExp');
    if (!expirationDate)
      return '';

    const expTime = new Date(expirationDate);
    if (new Date() > expTime) {
      this.logout();
      return '';
    }

    return localStorage.getItem('fbToken')!;
  }

  login(user: IUser) : Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap((response: any) => {
          const firebaseResponse : IFirebaseAuthResponse = { token: response.idToken, expiresIn: +response.expiresIn };
          this.setToken(firebaseResponse);
        }));
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: IFirebaseAuthResponse | null) {
    if (!response) {
      localStorage.clear();
      return;
    }
    const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
    localStorage.setItem('fbToken', response.token);
    localStorage.setItem('fbTokenExp', expirationDate.toString());
  }
}
