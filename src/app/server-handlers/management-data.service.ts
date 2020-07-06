import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../users/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementDataService {
  private API_SERVER = 'https://corvusgenerators.herokuapp.com/api';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  public getAllMods() {
    return this.httpClient.get(this.API_SERVER + '/mods', {observe: 'response'});
  }

  public getAllPageMods(pageName) {
    return this.httpClient.get(
      this.API_SERVER +
      '/getPageMods?name=' +
      pageName, {observe: 'response'});
  }

  public getAllPageUsers(pageName) {
    return this.httpClient.get(this.API_SERVER + '/getPageUsers?name=' + pageName, {observe: 'response'});
  }

  public updatePageUsers(newUsers: string[], pageName) {
    return this.httpClient.post(
      this.API_SERVER + '/updatePageUsers?name=' + pageName,
      {content: newUsers.toString()},
      {observe: 'response'}
    );
  }

  public removeUser(user) {
    return this.httpClient.post(
      this.API_SERVER + '/removeUser',
      {content: user.toString()},
      {observe: 'response'}
    );
  }

  public getAllAdmins() {
    return this.httpClient.get(this.API_SERVER + '/admins', {observe: 'response'});
  }

  public registerAdmin(adminId) {
    return this.httpClient.post(this.API_SERVER + '/registerAdmin', {content: adminId}, {observe: 'response'});
  }

  public getPageAdmin(pageName) {
    return this.httpClient.get(
      this.API_SERVER +
      '/getPageAdmin?name=' +
      pageName, {observe: 'response'});
  }

  public getAllPageSubAdmins(pageName) {
    return this.httpClient.get(
      this.API_SERVER +
      '/getPageSubAdmins?name=' +
      pageName, {observe: 'response'});
  }

  public updatePageMods(newMods: string[], pageName) {
    return this.httpClient.post(
      this.API_SERVER + '/updatePageMods?name=' + pageName,
      {content: newMods.toString()},
      {observe: 'response'}
    );
  }

  public updatePageSubAdmins(newSubAdmins: string[], pageName) {
    return this.httpClient.post(
      this.API_SERVER + '/updatePageSubAdmins?name=' + pageName,
      {content: newSubAdmins.toString()},
      {observe: 'response'}
    );
  }

  public updatePageAdmin(newAdmin, pageName) {
    return this.httpClient.post(
      this.API_SERVER + '/updatePageAdmin?name=' + pageName,
      {content: newAdmin.toString()},
      {observe: 'response'}
    );
  }

  public removeAdmin(admin) {
    return this.httpClient.post(
      this.API_SERVER + '/removeAdmin',
      {content: admin.toString()},
      {observe: 'response'}
    );
  }

  public getAllAvailableUsers() {
    return this.httpClient.get(this.API_SERVER + '/getAllAvailableUsers', {observe: 'response'});
  }

  public getAllUsers() {
    return this.httpClient.get(this.API_SERVER + '/users', {observe: 'response'});
  }

  public updatePassword(username, newPassword) {
    return this.httpClient.post(this.API_SERVER + '/updatePassword', {
      content: {
        username: username,
        password: newPassword
      }
    }, {observe: 'response'});
  }

  public resetPassword(username) {
    return this.httpClient.post(this.API_SERVER + '/resetPassword', {
      content: username
    }, {observe: 'response'});
  }

  public isUsernameValid(username) {
    return this.httpClient.get(this.API_SERVER + '/isUsernameAvailable?name=' + username, {observe: 'response'});
  }
}
