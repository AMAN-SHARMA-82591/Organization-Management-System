import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = localStorage.getItem('user');

    if (user) {
      const token = JSON.parse(user)._token;
      const request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(request).pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.authService.clearUser();
            throw new Error('Token Expired');
          }
          throw err;
        })
      );
    }
    return next.handle(req);
  }
}
