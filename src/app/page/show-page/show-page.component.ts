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

  constructor(service: QuestionService, private titleService:Title) {
    this.questions$ = service.getQuestions();
    this.template = 'template';
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

}
