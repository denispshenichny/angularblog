import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertService, AlertType, IAlert} from "../../services/alert.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 5000;

  public text: string = '';
  public type: AlertType = 'success';
  private alertSubscription!: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alert$.subscribe((alert: IAlert) => {
      this.text = alert.text;
      this.type = alert.type;

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.text = '';
      }, this.delay);
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription)
      this.alertSubscription.unsubscribe();
  }
}
