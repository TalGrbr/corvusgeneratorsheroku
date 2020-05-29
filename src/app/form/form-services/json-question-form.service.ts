import {Component, Injectable} from '@angular/core';
import {QuestionBase} from '../question-types/question-base';
import {DropdownQuestion} from '../question-types/question-dropdown';
import {QuestionControlService} from './question-control.service';
import {TextboxQuestion} from '../question-types/question-textbox';
import {BBcodeQuestion} from '../question-types/question-bbcode-box';

@Injectable({
  providedIn: 'root'
})

export class JsonQuestionFormService {

  constructor(private qcs: QuestionControlService) {
  }

  getQuestionsFromJson(json) {
    let questions: QuestionBase<string> [] = [];
    //json = JSON.parse(json);
    //json = json['questions'];
    (Object.keys(json)).forEach(i => {
      let element = json[i];
      if (element.questionType === 'dropBox') {
        questions.push(new DropdownQuestion({
          key: element.key || this.qcs.labelToKey(element.questionName),
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
          desc: element.desc,
          options: this.zipForDropDown(element.questionLabels.keys.split(','), element.questionLabels.values.split(','))
        }));
      } else if (element.questionType === 'textBox') {
        questions.push(new TextboxQuestion({
          key: element.key,
          label: element.questionName,
          order: element.order,
          required: element.hasOwnProperty('required') ? element.required : false,
          desc: element.desc,
          boxType: element.questionLabels.boxType
        }));
      } else if (element.questionType === 'bbCode') {
        questions.push(new BBcodeQuestion({
          key: element.key,
          label: element.questionName,
          order: element.order,
          desc: element.desc,
          required: element.hasOwnProperty('required') ? element.required : false,
        }));
      }
    });
    //console.log('questions length: ' + questions.length);
    return questions.sort((a, b) => a.order - b.order);
  }

  private zipForDropDown(keys, values) {
    let options = [];
    for (let i = 0; i < values.length; i++) {
      if (keys[i]) {
        options.push({key: keys[i], value: values[i]});
      } else {
        options.push({key: values[i], value: values[i]});
      }
    }
    return options;
  }
}
