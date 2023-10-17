import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastComponent } from './app/components/toast/toast.component';
import { DialogModule } from '@angular/cdk/dialog';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, DialogModule),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      toastComponent: ToastComponent,
    }),
  ],
}).catch((err) => console.error(err));
