import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {QuestionBase} from '../question-types/question-base';
import {QuestionControlService} from '../form-services/question-control.service';
import {toBBCode} from '../../utilities/htmlToBBCode';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './main-form.component.html',
  providers: [QuestionControlService]
})
export class MainFormComponent implements OnInit {

  @Input() questions: QuestionBase<string>[] = [];
  form: FormGroup;
  payLoad;

  constructor(private qcs: QuestionControlService) {
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = this.form.getRawValue();
    if (this.payLoad.hasOwnProperty('article')) {
      this.payLoad.article = toBBCode(this.form.get('article').value);
    }
    this.payLoad = JSON.stringify(this.payLoad);
  }
}
