import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {ToastService} from '../../../logging/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService, private toastService: ToastService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      this.toastService.showDanger('Access not allowed!');
      return false;
    }
    return true;
  }
}
