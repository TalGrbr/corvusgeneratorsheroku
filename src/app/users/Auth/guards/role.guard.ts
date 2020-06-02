import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(public authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.data['roles'] as Array<string>;
    // TODO: check in the server that the role is correct
    if (this.authService.isLoggedIn !== true || !roles.includes(this.authService.currentUser['role'])) {
      window.alert('Access not allowed!');
      return false;
    }
    return true;
  }
}
