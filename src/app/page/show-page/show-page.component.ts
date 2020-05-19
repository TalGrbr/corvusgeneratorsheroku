import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {QuestionBase} from '../../form/question-types/question-base';
import {QuestionService} from '../../form/form-services/question.service';
import {Page} from '../Page';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.css']
})
export class ShowPageComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;
  page: Page;
  template: string;
  payload: JSON;
  result = '';

  constructor(service: QuestionService, private titleService: Title) {
    this.questions$ = service.getQuestions();
    this.template = '%Article%';
    this.page = new Page({
      name: 'test name',
      color: '#00000',
      title: 'test title',
      about: '<b>test about</b>',
      remarks: ['<b>remark1</b>', 'remark2'],
      showForm: true
    });
    titleService.setTitle(this.page.name);
  }

  ngOnInit(): void {
  }

  updatePayload(value: string) {
    this.payload = JSON.parse(value);
    this.onSubmit();
  }

  onSubmit() {
    let names = this.getNamesToChange();
    let values = this.getValuesAsArray();
    let translationDict = {};

    names.forEach((name, index) => {
      translationDict[names[index]] = values[index];
    });

    console.log(translationDict);
    Object.keys(translationDict).forEach(key => {
      this.result = this.template.replace(key, translationDict[key]);
    });
  }

  private getValuesAsArray() {
    let values = [];
    Object.keys(this.payload).forEach(i => {
      values.push(this.payload[i]);
    });
    return values;
  }

  private getNamesToChange() {
    let names = [];
    let namesObserver = {
      next: qList => qList.forEach(q => names.push(q.label)),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    this.questions$.subscribe(namesObserver);
    for (let name of names) {
      names[names.indexOf(name)] = '%' + name + '%';
    }
    return names;
  }
}
