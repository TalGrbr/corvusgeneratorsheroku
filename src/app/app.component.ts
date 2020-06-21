import {Component} from '@angular/core';

import {QuestionService} from './form/form-services/question.service';
import {AuthService} from './users/Auth/auth.service';
import {Title} from '@angular/platform-browser';
import {last} from 'rxjs/operators';

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
    /*const lastLogin = authService.timestamp;
    if (lastLogin && lastLogin !== -1) {
      const diffDays = Math.ceil((Date.now() - lastLogin) / (1000 * 60 * 60 * 24));
      if (diffDays >= 1) {
        authService.logout();
      }
    } else {
      authService.logout();
    }*/
  }

  updateLogout($event: any) {
    this.role = 'guest';
    this.isLogged = false;
  }
}
