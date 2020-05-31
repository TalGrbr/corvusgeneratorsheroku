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
  API_URL = 'http://localhost:8000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient, public router: Router) {
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
        this.currentUser = res;
        console.log(res.message);
        this.router.navigate(['main']);
      }, error => {
        if (error.status === 403) {
          alert(error.error.message);
        }
      });
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  logout() {
    if (localStorage.removeItem('access_token') == null) {
      this.router.navigate(['main']);
    }
  }

  getUserProfile(id): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/profile/${id}`, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
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
}
