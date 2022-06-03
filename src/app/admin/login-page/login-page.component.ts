import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IUser} from "../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;
  isRelogin : boolean = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['relogin']) {
        this.isRelogin = true;
        setTimeout(() => this.isRelogin = false, 5000);
      }
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
