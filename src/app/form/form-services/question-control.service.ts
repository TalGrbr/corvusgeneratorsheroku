import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {QuestionBase} from '../question-types/question-base';
import {TextboxQuestion} from '../question-types/question-textbox';
import {DropdownQuestion} from '../question-types/question-dropdown';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) {
  }

  toFormGroup(questions: QuestionBase<string>[]) {
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }

  toFormFormGroup(questions: QuestionBase<string>[]) {
    let formForm = this.fb.group({
      questions: this.fb.array([])
    });
    let control = formForm.controls.questions as FormArray;
    questions.forEach(question => {
      if (question instanceof TextboxQuestion) {
        control.push(
          this.fb.group({
            questionType: 'textBox',
            questionName: question.label,
            order: question.order,
            required: question.required,
            desc: question.desc,
            questionLabels: this.fb.group({
              boxType: question.boxType
            })
          })
        );
      } else if (question instanceof DropdownQuestion) {
        control.push(
          this.fb.group({
            questionType: ['dropBox'],
            questionName: question.label,
            order: question.order,
            required: question.required,
            desc: question.desc,
            questionLabels: this.fb.group({
              keys: this.getKeysFromListDict(question.options),
              values: this.getValuesFromListDict(question.options)
            })
          }));
      }
    });
    return formForm;
  }

  labelToKey(label: string) {
    let labels = label.split(' ');
    let key = '';
    key += labels[0]; // add first word to key
    labels.shift(); // remove first word
    labels.forEach(l => {
      key += l[0].toUpperCase() + l.substr(1);
    });
    return key;
  }

  private getKeysFromListDict(dict) {
    let list = [];
    dict.forEach(element => {
      //alert(element.key);
      list.push(element.key);
    });
    //alert('keys: ' + JSON.stringify(list));
    return list.toString();
  }

  private getValuesFromListDict(dict) {
    let list = [];
    dict.forEach(element => {
      //alert(typeof element.value);
      list.push(element.value);
    });
    //alert('values: ' + JSON.stringify(list));
    return list.toString();
  }

  optionStringToDict(options: string) {
    let optionsList = options.split(',');
    let dict = [];
    optionsList.forEach(option => {
      dict = [...dict, {key: option.trim(), value: option.trim()}];
    });
    return dict;
  }
}
