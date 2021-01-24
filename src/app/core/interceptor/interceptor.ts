import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth.interceptor'

export const interceptorProviders =
   [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
];
