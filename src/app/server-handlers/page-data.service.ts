import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Page} from '../page/Page';
import {JsonQuestionFormService} from '../form/form-services/json-question-form.service';
import {AuthService} from '../users/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private API_SERVER = 'http://localhost:8000';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  public getPageFromServer(pageName: string) {
    //console.log('requesting page: ' + this.API_SERVER + '/showPage?name=' + pageName);
    return this.httpClient.get(this.API_SERVER + '/showPage?name=' + pageName, {observe: 'response'});
  }

  public getAllPages() {
    return this.httpClient.get(this.API_SERVER + '/pages', {observe: 'response'});
  }

  public getRelatedPages() {
    return this.httpClient.get(this.API_SERVER + '/pagesByUser', {observe: 'response'});
  }

  public postPageToServer(page) {
    // const page = new Page({name: 'name', showForm: true, remarks: ['1', '2'], about: 'about', title: 'title', color: 'black'});
    // console.log(JSON.stringify(page));
    return this.httpClient.post(this.API_SERVER + '/savePage', {
      data: page,
    }, this.httpOptions);
  }

  postUpdatePageToServer(oldPageName, newPage) {
    return this.httpClient.post(this.API_SERVER + '/updatePage?name=' + oldPageName, {
      content: newPage,
    }, this.httpOptions);
  }

  postDeletePageToServer(pageNameToDelete) {
    return this.httpClient.post(this.API_SERVER + '/deletePage?name=' + pageNameToDelete, this.httpOptions);
  }

  public isPageNameValid(pageName) {
    return this.httpClient.get(this.API_SERVER + '/isPageNameAvailable?name=' + pageName, {observe: 'response'});
  }

  public getThreads(forumId) {
    return this.httpClient.get(this.API_SERVER + '/get5Threads?id=' + forumId, {observe: 'response'});
  }
}
