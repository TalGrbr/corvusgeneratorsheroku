import {QuestionBase} from './question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  boxType: string;
  desc: string;

  constructor(options: {} = {}) {
    super(options);
    this.boxType = options['boxType'] || '';
    this.desc = options['desc'] || '';
  }
}
