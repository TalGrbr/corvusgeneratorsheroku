import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {QuestionBase} from '../question-types/question-base';
import {QuestionService} from '../form-services/question.service';
import {Form, FormGroup} from '@angular/forms';
import {QuestionControlService} from '../form-services/question-control.service';

@Component({
  selector: 'app-update-form-page',
  templateUrl: './update-form-page.component.html',
  styleUrls: ['./update-form-page.component.css']
})
export class UpdateFormPageComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;

  constructor(qs: QuestionService) {
    this.questions$ = qs.getFormToUpdate();
  }

  ngOnInit(): void {
  }

}
