import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {User} from '../user';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _currentUser;
  API_URL = 'http://localhost:8000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient, public router: Router) {
  }

  register(username): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/registerUser?username=` + username, {bearer: this.getUsername()}, {observe: 'response'}).pipe(
      catchError(this.handleError)
    );
  }

  login(user: User) {
    return this.httpClient.post<any>(`${this.API_URL}/loginUser`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.currentUser = {username: res.username, role: res.role};
        this.router.navigate(['main']);
      }, error => {
        if (error.error.message) {
          alert(error.error.message);
        } else {
          alert('unknown server error');
        }
      });
  }


  set currentUser(value) {
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
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  logout() {
    this.currentUser = null;
    if (localStorage.removeItem('access_token') == null && localStorage.removeItem('cur_user') == null) {
      this.router.navigate(['main']);
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

  getRole() {
    return this.currentUser['role'] || 'Guest';
  }
}
