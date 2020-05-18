import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../form/question-types/question-base';
import {copy} from '../utilities/copyToClipBoard';
import {FormGroup} from '@angular/forms';
import {QuestionControlService} from '../form/form-services/question-control.service';

@Component({
  selector: 'app-update-template',
  templateUrl: './update-template.component.html',
  styleUrls: ['./update-template.component.css']
})
export class UpdateTemplateComponent implements OnInit {
  @Input() questionsForm: FormGroup;
  @Input() curTemplate: string;
  editorContent = '';

  constructor() {
  }

  ngOnInit(): void {
    this.editorContent = this.curTemplate;
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

  onTemplateSubmit() {
    // TODO: update on server side the corresponding template
    // DONT FORGET TO TRANSLATE TO BBCODE
  }

  copyQuestionNameTag(name: any) {
    //alert(this.editorContent); WORKING
    copy('%' + name + '%');
  }
}
