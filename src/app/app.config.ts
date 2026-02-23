import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { authInterceptor } from './user-shared/LoginandRegister/Auth/auth/auth-interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Import here


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes ,  withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideMarkdown(),
    provideToastr(),
    provideAnimations()
  ]
};
