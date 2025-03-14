import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import {HttpClientModule, provideHttpClient} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import {SuccessDialogComponent} from "./Component/dialogs/success-dialog/dialog.component";

export const appConfig: ApplicationConfig = {
  providers: [

    importProvidersFrom(HttpClientModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    CookieService,
    importProvidersFrom(BrowserModule, FormsModule),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: false,
      progressBar: true,
    }),
    SuccessDialogComponent

  ]

};

