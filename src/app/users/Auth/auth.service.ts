import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {User} from '../user';
import {ToastService} from '../../logging/toast.service';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _currentUser;
  API_URL = 'http://localhost:8000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient, public router: Router, private toastService: ToastService) {
  }

  register(username): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/registerUser?username=` + username, {observe: 'response'}).pipe(
      catchError(this.handleError)
    );
  }

  login(user: User) {
    return this.httpClient.post<any>(`${this.API_URL}/loginUser`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('init_pass', res.init_pass);
        // this.currentUser = {username: res.username, role: res.role};
        this.setCurrentUser({username: res.username, role: res.role, logged_time_stamp: Date.now()});
        this.router.navigate(['main']);
      }, error => {
        if (error.error.message) {
          this.toastService.showDanger(error.error.message);
        } else {
          this.toastService.showDanger('unknown server error');
        }
      });
  }

  get timestamp() {
    if (this.currentUser && this.currentUser.length > 0){
      return Date.parse(JSON.parse(this.currentUser)['logged_time_stamp']) || -1;
    } else {
      return -1;
    }
  }

  private setCurrentUser(value) {
    this._currentUser = value;
    localStorage.setItem('cur_user', JSON.stringify(this._currentUser));
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('cur_user')) || '';
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    // let authToken = localStorage.getItem('access_token');
    return (localStorage.getItem('access_token') !== null);
  }

  logout() {
    // this.currentUser = null;
    this.setCurrentUser(null); // TODO: check if this works
    if (localStorage.removeItem('access_token') == null &&
      localStorage.removeItem('cur_user') == null &&
      localStorage.removeItem('init_pass') == null) {
      this.router.navigate(['main']);
    }
  }

  public getInitPass() {
    const initPass = localStorage.getItem('init_pass');
    if (initPass) {
      return initPass;
    }
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  getUsername() {
    return this.currentUser['username'] || 'Guest';
  }

  public getPageRole(pageName) {
    return this.httpClient.get(this.API_URL + '/getRoleInPage?name=' + pageName, {observe: 'response'});
  }

  public getWebsiteRole() {
    return this.httpClient.get(this.API_URL + '/getRole', {observe: 'response'});
  }
}
