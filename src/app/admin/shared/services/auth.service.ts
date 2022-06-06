import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IFirebaseAuthResponse, IUser} from "../../../shared/interfaces";
import {Observable, throwError, Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

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
        }),
        catchError(error => this.handleError(error))
      );
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

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;
    switch(message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Invalid email');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password');
        break;
    }
    return throwError(error);
  }
}
