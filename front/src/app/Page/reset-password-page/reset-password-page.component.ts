import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "../../Services/API-Service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserInfoService} from "../../Services/DATA-Service/user-data-service/user-info.service";

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.css'
})
export class ResetPasswordPageComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {}

  public token: string | null = '';
  public passwordRegex:RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  public errorMsg: string = "";

  forgetForm = new FormGroup({
    password: new FormControl(""),
    confirmPassword: new FormControl(""),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }
  sendFormForget(){

    if (this.forgetForm.value.password !== this.forgetForm.value.confirmPassword) {
      this.errorMsg = "Passwords do not match";
      return;
    }

    // @ts-ignore
    if (!this.passwordRegex.test(<string>this.forgetForm.value.password) && this.forgetForm.value.password?.length >= 8) {
      this.errorMsg = "Invalid password";
      return;
    }

    const data = { newPassword: this.forgetForm.value.password };
    this.apiService.post(`auth/process-reset-password?token=${this.token}`, data).subscribe(
      data => {
        this.router.navigate([`/login`]);
      },
      error => {

        console.log("Error: " + JSON.stringify(error));

      }
    );
  }
}
