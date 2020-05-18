import {Component} from '@angular/core';

import {QuestionService} from './form/form-services/question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [QuestionService]
})
export class AppComponent {

  constructor() {
  }
}
