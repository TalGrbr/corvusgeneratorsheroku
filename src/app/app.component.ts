import {Component} from '@angular/core';

import {QuestionService} from './form/form-services/question.service';
import {AuthService} from './users/Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [QuestionService]
})
export class AppComponent {

  constructor(public authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
