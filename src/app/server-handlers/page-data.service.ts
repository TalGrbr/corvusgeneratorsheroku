import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Page} from '../page/Page';
import {JsonQuestionFormService} from '../form/form-services/json-question-form.service';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private API_SERVER = 'http://localhost:8000';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


  constructor(private httpClient: HttpClient) {
  }

  public getPageFromServer(pageName: string) {
    //console.log('requesting page: ' + this.API_SERVER + '/showPage?name=' + pageName);
    return this.httpClient.get(this.API_SERVER + '/showPage?name=' + pageName, { observe: 'response' });
  }

  public getAllPages() {
    return this.httpClient.get(this.API_SERVER + '/pages', { observe: 'response' });
  }

  public postPageToServer(page) {
    // const page = new Page({name: 'name', showForm: true, remarks: ['1', '2'], about: 'about', title: 'title', color: 'black'});
    // console.log(JSON.stringify(page));
    return this.httpClient.post(this.API_SERVER + '/savePage?name=' + page.name, page, this.httpOptions);
  }

  postUpdatePageToServer(oldPageName, newPage) {
    return this.httpClient.post(this.API_SERVER + '/updatePage?name=' + oldPageName, newPage, this.httpOptions);
  }

  postDeletePageToServer(pageNameToDelete) {
    return this.httpClient.post(this.API_SERVER + '/deletePage?name=' + pageNameToDelete, this.httpOptions);
  }
}
