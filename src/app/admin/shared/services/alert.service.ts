import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

export type AlertType = 'success' | 'danger' | 'warning';

export interface IAlert {
  type: AlertType,
  text: string
}

@Injectable({providedIn: 'root'})
export class AlertService {
  private alert = new Subject<IAlert>();

  public get alert$(): Observable<IAlert> {
    return this.alert.asObservable();
  }

  public success(text: string) {
    this.alert.next({text, type: 'success'})
  }

  public danger(text: string) {
    this.alert.next({text, type: 'danger'})
  }

  public warning(text: string) {
    this.alert.next({text, type: 'warning'})
  }
}
