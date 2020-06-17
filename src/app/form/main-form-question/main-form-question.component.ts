import {AfterViewChecked, Component, DoCheck, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionBase} from '../question-types/question-base';

@Component({
  selector: 'app-question',
  templateUrl: './main-form-question.component.html'
})
export class MainFormQuestionComponent implements OnInit {
  @Input() question: QuestionBase<string>;
  @Input() form: FormGroup;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

  ngOnInit(): void {
  }
}
