import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';
import {ToastService} from '../../../logging/toast.service';

@Injectable({
  providedIn: 'root'
})
export class WebsiteRoleGuard implements CanActivate {

  constructor(public authService: AuthService, private toastService: ToastService) {
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
        this.toastService.showDanger('Access not allowed!');
        return false;
      }
      return true;
    }));
  }
}
