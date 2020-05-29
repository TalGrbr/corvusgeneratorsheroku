import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {QuestionBase} from '../../form/question-types/question-base';
import {QuestionService} from '../../form/form-services/question.service';
import {Page} from '../Page';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../server-handlers/page-data.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';
import {ActivatedRoute} from '@angular/router';
import {Utils} from '../../utilities/Utils';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.css']
})
export class ShowPageComponent implements OnInit {
  readonly showPageName;
  questions: QuestionBase<any>[];
  page = new Page({});
  template: string;
  payload: JSON;
  result = '';

  constructor(private titleService: Title, pds: PageDataService, jqf: JsonQuestionFormService, private route: ActivatedRoute) {
    this.showPageName = this.route.snapshot.paramMap.get('name');
    let self = this;
    pds.getPageFromServer(this.showPageName).subscribe((data: any) => {
      //console.log('data from server: ' + JSON.stringify(data));
      data = JSON.parse(JSON.stringify(data)
        .split(Utils.DOUBLE_QUOTES_REPLACEMENT)
        .join(Utils.DOUBLE_QUOTES)
        .split(Utils.SINGLE_QUOTES_REPLACEMENT)
        .join(Utils.SINGLE_QUOTES));
      //console.log('data from server after change: ' + JSON.stringify(data));
      self.page = new Page({
        name: data.name,
        color: data.color,
        title: data.title,
        about: data.about,
        remarks: data.remarks,
        showForm: data.showForm
      });
      self.template = data.template;
      self.questions = jqf.getQuestionsFromJson(data.questions);
    });
    titleService.setTitle(this.showPageName);
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

    //console.log(translationDict);
    Object.keys(translationDict).forEach(key => {
      this.template = this.template.replace(key, translationDict[key]);
    });
    this.result = this.template;
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
    this.questions.forEach(q => {
      names.push('%' + q.getLabel() + '%');
    });
    return names;
  }
}
