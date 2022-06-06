import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IFirebaseAuthResponse, IUser} from "../../../shared/interfaces";
import {Observable, throwError, Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {AlertService} from "./alert.service";

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient, private alertService: AlertService) { }

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

  private getAlertText(message: string): string {
    switch(message) {
      case 'EMAIL_NOT_FOUND': return 'Invalid email';
      case 'INVALID_EMAIL': return 'Invalid email';
      case 'INVALID_PASSWORD': return 'Invalid password';
      default: return '';
    }
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;
    const alertText: string = this.getAlertText(message);
    if (alertText)
      this.alertService.danger(alertText);

    return throwError(error);
  }
}
