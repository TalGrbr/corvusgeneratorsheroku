import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() payLoadEvent = new EventEmitter<string>();

  constructor(private qcs: QuestionControlService) {
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onFormSubmitted() {
    this.payLoad = this.form.getRawValue();
    alert(JSON.stringify(this.payLoad));
    if (this.payLoad.hasOwnProperty('article')) {
      this.payLoad.article = toBBCode(this.form.get('article').value);
    }
    this.payLoad = JSON.stringify(this.payLoad);
    this.payLoadEvent.emit(this.payLoad);
  }
}
