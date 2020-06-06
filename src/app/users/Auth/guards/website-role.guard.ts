import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsiteRoleGuard implements CanActivate {

  constructor(public authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const allowedRoles = next.data['roles'] as Array<string>;
    let curRole = 'Guest';
    return this.authService.getWebsiteRole().pipe(map((data) => {
      if (data && data.body['role']) {
        curRole = data.body['role'];
      }
      if (this.authService.isLoggedIn !== true || !allowedRoles.includes(curRole)) {
        window.alert('Access not allowed!');
        return false;
      }
      return true;
    }));
  }
}
