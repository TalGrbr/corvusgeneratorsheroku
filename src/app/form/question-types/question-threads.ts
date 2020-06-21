import {QuestionBase} from './question-base';

export class ThreadsQuestion extends QuestionBase<string> {
  controlType = 'threads';
  forumId: number;

  constructor(options: {} = {}) {
    super(options);
    this.forumId = options['forumId'] || '';
  }
}
