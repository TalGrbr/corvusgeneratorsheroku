import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Page} from '../page/Page';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private API_SERVER = 'http://localhost:8000/main';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


  constructor(private httpClient: HttpClient) {
  }

  public sendGetRequest() {
    return this.httpClient.get(this.API_SERVER);
  }

  public sendPostRequest() {
    const page = new Page({name: 'name', showForm: true, remarks: ['1', '2'], about: 'about', title: 'title', color: 'black'});
    console.log(JSON.stringify(page));
    return this.httpClient.post(this.API_SERVER, JSON.stringify(page), this.httpOptions);
  }
}
