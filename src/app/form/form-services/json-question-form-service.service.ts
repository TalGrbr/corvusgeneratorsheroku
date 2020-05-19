import {Injectable} from '@angular/core';
import {QuestionBase} from '../question-types/question-base';
import {DropdownQuestion} from '../question-types/question-dropdown';
import {QuestionControlService} from './question-control.service';
import {TextboxQuestion} from '../question-types/question-textbox';
import {BBcodeQuestion} from '../question-types/question-bbcode-box';

@Injectable({
  providedIn: 'root'
})
export class JsonQuestionFormServiceService {

  constructor(private qcs: QuestionControlService) {
  }

  getQuestionsFromJson(json) {
    let questions: QuestionBase<string> [] = [];
    json = JSON.parse(json);
    json = json['questions'];
    (Object.keys(json)).forEach(i => {
      let element = json[i];
      console.log(element);
      if (element.questionType === 'dropBox') {
        questions.push(new DropdownQuestion({
          key: element.key || this.qcs.labelToKey(element.questionName),
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
          options: element.questionLabels.forums
        }));
      } else if (element.questionType === 'textBox') {
        questions.push(new TextboxQuestion({
          key: element.key,
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
          desc: element.questionLabels.desc,
          boxType: element.questionLabels.boxType
        }));
      } else if (element.questionType === 'bbCode') {
        questions.push(new BBcodeQuestion({
          key: element.key,
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
        }));
      }
    });
    console.log('questions length: ' + questions.length);
    return questions;
  }
}
