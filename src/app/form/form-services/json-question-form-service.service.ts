import {Injectable} from '@angular/core';
import {QuestionBase} from '../question-types/question-base';
import {DropdownQuestion} from '../question-types/question-dropdown';
import {QuestionControlService} from './question-control.service';
import {TextboxQuestion} from '../question-types/question-textbox';

@Injectable({
  providedIn: 'root'
})
export class JsonQuestionFormServiceService {

  constructor(private qcs: QuestionControlService) {
  }

  getQuestionFromJson(json) {

  }

  getQuestionFormFromJson(json) {
    let questions: QuestionBase<string> [] = [];

    json.forEach(element => {
      if (element.questionType === 'dropBox') {
        questions.push(new DropdownQuestion({
          key: element.key,
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
          options: this.qcs.optionStringToDict(element.options)
        }));
      } else if (element.questionType === 'textBox') {
        questions.push(new TextboxQuestion({
          key: element.key,
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
          desc: element.desc,
          boxType: element.boxType
        }));
      }
    });

    return questions;
  }
}
