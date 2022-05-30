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
    return '';
  }

  login(user: IUser) : Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap((response: any) => {
          const firebaseResponse : IFirebaseAuthResponse = { token: response.idToken };
          this.setToken(firebaseResponse);
        }));
  }

  logout() {

  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: IFirebaseAuthResponse) {
    console.log(response);
  }
}
