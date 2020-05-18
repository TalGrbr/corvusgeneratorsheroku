import {QuestionBase} from './question-base';

export class BBcodeQuestion extends QuestionBase<string> {
  controlType = 'bbcode';

  constructor(options: {} = {}) {
    super(options);
  }
}
