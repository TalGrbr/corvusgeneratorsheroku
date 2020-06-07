import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';
import {QuestionBase} from '../../form/question-types/question-base';
import {QuestionService} from '../../form/form-services/question.service';
import {Page} from '../Page';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../server-handlers/page-data.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';
import {ActivatedRoute} from '@angular/router';
import {Utils} from '../../utilities/Utils';
import {AuthService} from '../../users/Auth/auth.service';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.css']
})
export class ShowPageComponent implements OnInit {
  readonly showPageName;
  role;
  questions: QuestionBase<any>[];
  page = new Page({});
  template: string;
  payload: JSON;
  result = '';

  constructor(private titleService: Title,
              pds: PageDataService,
              jqf: JsonQuestionFormService,
              private route: ActivatedRoute,
              private location: Location,
              private authService: AuthService) {
    this.showPageName = this.route.snapshot.paramMap.get('name');
    this.authService.getPageRole(this.showPageName).subscribe(data => this.role = data.body['role']);
    pds.getPageFromServer(this.showPageName).subscribe((data: any) => {
        //console.log('data from server: ' + JSON.stringify(data));
        data = JSON.parse(JSON.stringify(data.body)
          .split(Utils.DOUBLE_QUOTES_REPLACEMENT)
          .join(Utils.DOUBLE_QUOTES)
          .split(Utils.SINGLE_QUOTES_REPLACEMENT)
          .join(Utils.SINGLE_QUOTES)
          .split(Utils.NEW_LINE_REPLACEMENT)
          .join(Utils.NEW_LINE));
        // console.log('data from server after change: ' + JSON.stringify(data));
        this.page = new Page({
          name: data.name,
          color: data.color,
          title: data.title,
          about: data.about,
          remarks: data.remarks,
          showForm: data.showForm
        });
        this.template = data.template;
        this.questions = jqf.getQuestionsFromJson(data.questions);
      },
      err => {
        console.log(err);
        alert(err.error.message);
        location.back();
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
    let translationDict = this.getTranslationDict();

    Object.keys(translationDict).forEach(key => {
      this.template = this.template.replace(key, translationDict[key]);
    });
    this.result = this.template;
  }

  private getTranslationDict() {
    let translationDict = {};
    const names = this.getNamesToChange();
    names.forEach(name => {
      translationDict[name] = this.payload[name.substr(1, name.length - 2)];
    });
    return translationDict;
  }

  private getNamesToChange() {
    let names = [];
    this.questions.forEach(q => {
      names.push('%' + q.getLabel() + '%');
      if (q.controlType === 'dropdown') {
        names.push('%' + q.getLabel() + '-key%');
      }
    });
    return names;
  }
}
