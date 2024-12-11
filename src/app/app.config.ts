import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import '@fullcalendar/web-component/global'
import { routes } from './app.routes';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { DatePipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from '@shared/interceptor/api.interceptor';
import { tokenInterceptor } from '@shared/interceptor/token.interceptor';
import { HttpErrorInterceptor } from '@shared/interceptor/http-error.interceptor';
import { serverErrorInterceptor } from '@shared/interceptor/server-error.interceptor';


registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withComponentInputBinding()),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor,apiInterceptor])),
    DatePipe
  ],
};
