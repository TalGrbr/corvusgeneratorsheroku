import {Component} from '@angular/core';

import {QuestionService} from './form/form-services/question.service';
import {AuthService} from './users/Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [QuestionService]
})
export class AppComponent {
  private role;
  private isLogged = false;

  constructor(public authService: AuthService) {
    authService.getWebsiteRole().subscribe(data => this.role = data.body['role']);
  }

  logout() {
    this.authService.logout();
    this.role = 'guest';
    this.isLogged = false;
  }

  isVisible(roles) {
    if (this.authService.isLoggedIn && !this.isLogged) { // detect logging in
      this.authService.getWebsiteRole().subscribe(data => this.role = data.body['role']);
      this.isLogged = true;
    }
    return roles.includes(this.role);
  }
}
