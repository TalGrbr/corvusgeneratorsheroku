import {Component} from '@angular/core';

import {QuestionService} from './form/form-services/question.service';
import {AuthService} from './users/Auth/auth.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [QuestionService]
})
export class AppComponent {
  private role;
  private isLogged = false;
  private readonly title = 'Corvus Generators';

  constructor(public authService: AuthService, private titleService: Title) {
    authService.getWebsiteRole().subscribe(data => this.role = data.body['role']);
    titleService.setTitle(this.title);
  }

  updateLogout($event: any) {
    this.role = 'guest';
    this.isLogged = false;
  }
}
