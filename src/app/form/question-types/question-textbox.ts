import {QuestionBase} from './question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  boxType: string;

  constructor(options: {} = {}) {
    super(options);
    this.boxType = options['boxType'] || '';
  }
}
