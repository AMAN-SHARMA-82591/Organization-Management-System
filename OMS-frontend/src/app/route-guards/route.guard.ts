import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);

      return false;
    }

    return this.authService.getUserAccesses().includes(route.path);
  }
}
