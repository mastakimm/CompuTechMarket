import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ApiService } from "../../Services/API-Service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {UserInfoService} from "../../Services/DATA-Service/user-data-service/user-info.service";
import {DecimalPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-otp-form-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    MatProgressSpinner
  ],
  templateUrl: './otp-form-page.component.html',
  styleUrls: ['./otp-form-page.component.css']
})
export class OtpFormPageComponent implements OnInit{
  @ViewChild('otp1') otp1!: ElementRef<HTMLInputElement>;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private userDataService : UserInfoService,
    private route: ActivatedRoute,
  ) {}

  private userEmail: string = "";

  public errorMsg: string = "";
  minutes: number = 15;
  seconds: number = 0;
  timerRunning: boolean = false;
  interval: any;
  showResend: boolean = false;
  loading: boolean = false;

  //Début de logique du formulaire ( initialisation, reset après submit et logique de focus après chaque entrée )

  otpForm = new FormGroup({
    numberOne: new FormControl(""),
    numberTwo: new FormControl(""),
    numberThree: new FormControl(""),
    numberFour: new FormControl(""),
  });

  resetForm() {
    this.otpForm.reset();
    this.otp1.nativeElement.focus();
  }

  onInput(event: Event, nextInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
    if(!nextInput) {
      this.onSubmit()
    }
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
    });
    this.startTimer();
  }

  // Timer pour indiquer au client le couldown d'expiration de l'otp

  startTimer() {
    this.timerRunning = true;
    this.interval = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.timerFinished();
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.interval);
    this.minutes = 15;
    this.seconds = 0;
    this.timerRunning = false;
    this.startTimer();
  }

  timerFinished() {
    clearInterval(this.interval);
    this.timerRunning = false;
    this.showResend = true;
  }


  // Requête d'envoie de l'otp + Logique de renvoie si éxpiré
  onSubmit() {

    this.loading = true;
    // @ts-ignore
    const otpCode = this.otpForm.value.numberOne + this.otpForm.value.numberTwo+ this.otpForm.value.numberThree+ this.otpForm.value.numberFour;
    const userEmail = this.userDataService.getData();

    this.resetForm();

    this.apiService.post(`auth/verify-otp?email=${this.userEmail}&otp=${otpCode}`).subscribe(
      data => {
        this.router.navigate(['/']);
      },
      error => {
        this.errorMsg = "Code invalide ou expiré, veuillez réessayer.";
        this.showResend = true;
        console.log("Error: " + JSON.stringify(error));
      }
    );

  }

  resendOtp(){
    this.showResend = false;
    this.resetForm();
    const data = { email: this.userDataService.getData() };

    if (this.userEmail !== null || true) {
      data.email = this.userEmail;
    }

    this.apiService.post('auth/resend-otp', data).subscribe(
      data => {
        console.log(data)
        this.resetTimer();
      },
      error => {
        this.errorMsg = "Network error, please try again";
        console.log("Error: " + JSON.stringify(error));
      }
    );
  }

}
