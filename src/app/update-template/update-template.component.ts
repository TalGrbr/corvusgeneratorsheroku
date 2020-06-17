import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionBase} from '../form/question-types/question-base';
import {copy} from '../utilities/copyToClipBoard';
import {FormGroup} from '@angular/forms';
import {QuestionControlService} from '../form/form-services/question-control.service';
import {toBBCode} from '../utilities/htmlToBBCode';
import {Utils} from '../utilities/Utils';

@Component({
  selector: 'app-update-template',
  templateUrl: './update-template.component.html',
  styleUrls: ['./update-template.component.css']
})
export class UpdateTemplateComponent implements OnInit, AfterViewInit {
  @Input() questionsForm: FormGroup;
  @Input() curTemplate: string;
  editorContent = '';
  @Output() editorContentEvent = new EventEmitter<string>();
  loadingEditor = true;

  constructor() {
  }

  ngOnInit(): void {
    if (this.curTemplate) {
      this.editorContent = this.curTemplate.split('\n').join('<br>');
      this.editorContentEvent.emit(this.editorContent);
    }
  }

  ngAfterViewInit() {
    this.loadingEditor = !document.getElementById('bbCodeEditor').hasChildNodes();
  }

  getQuestionsNames() {
    let names = [];
    if (this.questionsForm) {
      this.questionsForm.get('questions')['controls'].forEach(q => {
        names.push(q.get('questionName').value);
        if (q.get('questionType').value === 'dropBox') {
          names.push(q.get('questionName').value + '-key');
        }
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
