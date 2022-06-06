import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IUser} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['relogin'])
        this.alertService.danger('Please authorize');
    });

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  submit() {
    if (this.form.invalid)
      return;

    const user: IUser = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.auth.login(user).subscribe(response => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard'])
    })
  }
}
