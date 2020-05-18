import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {QuestionBase} from '../../form/question-types/question-base';
import {QuestionService} from '../../form/form-services/question.service';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.css']
})
export class ShowPageComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;

  constructor(service: QuestionService) {
    this.questions$ = service.getQuestions();
  }
  ngOnInit(): void {
  }

}
