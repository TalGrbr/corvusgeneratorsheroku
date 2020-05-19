import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionBase} from '../form/question-types/question-base';
import {copy} from '../utilities/copyToClipBoard';
import {FormGroup} from '@angular/forms';
import {QuestionControlService} from '../form/form-services/question-control.service';
import {toBBCode} from '../utilities/htmlToBBCode';

@Component({
  selector: 'app-update-template',
  templateUrl: './update-template.component.html',
  styleUrls: ['./update-template.component.css']
})
export class UpdateTemplateComponent implements OnInit {
  @Input() questionsForm: FormGroup;
  @Input() curTemplate: string;
  editorContent = '';
  @Output() editorContentEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
    this.editorContent = this.curTemplate;
    this.editorContentEvent.emit(this.editorContent);
  }

  getQuestionsNames() {
    let names = [];
    if (this.questionsForm) {
      this.questionsForm.get('questions')['controls'].forEach(q => {
        names.push(q.get('questionName').value);
      });
    }
    return names;
  }

  copyQuestionNameTag(name: any) {
    copy('%' + name + '%');
  }

  updateEmitter() {
    this.editorContentEvent.emit(toBBCode(this.editorContent));
  }
}
