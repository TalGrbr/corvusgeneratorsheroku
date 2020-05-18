import {Injectable} from '@angular/core';

import {DropdownQuestion} from '../question-types/question-dropdown';
import {QuestionBase} from '../question-types/question-base';
import {TextboxQuestion} from '../question-types/question-textbox';
import {BBcodeQuestion} from '../question-types/question-bbcode-box';
import {of} from 'rxjs';

@Injectable()
export class QuestionService {
  // TODO: get from a remote source of question metadata
  getQuestions() {
    let questions: QuestionBase<string>[] = [

      new DropdownQuestion({
        key: 'relvForum',
        label: 'Relevant Forum',
        options: [
          {key: 'forum1', value: 'forum1'},
          {key: 'bla', value: 'bla'},
          {key: 'blabla', value: 'blabla'},
          {key: 'blablabla', value: 'blablabla'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'title',
        label: 'Article Title',
        dec: 'kaki',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        boxType: 'email',
        dec: 'kaki',
        order: 2
      }),

      new BBcodeQuestion({
        key: 'article',
        label: 'Article',
        order: 4,
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getFormToUpdate() {
    let questions: QuestionBase<string>[] = [

      new DropdownQuestion({
        key: 'relvForum',
        label: 'Relevant Forum',
        required: true,
        options: [
          {key: 'forum1', value: 'forum1'},
          {key: 'bla', value: 'bla'},
          {key: 'blabla', value: 'blabla'},
          {key: 'blablabla', value: 'blablabla'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'titleUpdate',
        label: 'Article Title',
        dec: 'kaki',
        required: true,
        order: 1,
        boxType: 'text',
        desc: 'desc kaki'
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        boxType: 'email',
        desc: 'kaki',
        order: 2
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
}
