import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Page} from '../page/Page';
import {JsonQuestionFormService} from '../form/form-services/json-question-form.service';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private API_SERVER = 'http://localhost:8000/showPage';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


  constructor(private httpClient: HttpClient) {
  }

  public sendGetRequest(pageName: string) {
    console.log('requesting page: ' + this.API_SERVER + '?name=' + pageName);
    return this.httpClient.get(this.API_SERVER + '?name=' + pageName);
  }

  public sendPostRequest() {
    const page = new Page({name: 'name', showForm: true, remarks: ['1', '2'], about: 'about', title: 'title', color: 'black'});
    console.log(JSON.stringify(page));
    return this.httpClient.post(this.API_SERVER, JSON.stringify(page), this.httpOptions);
  }
}
