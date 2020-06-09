import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
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
import {QuestionControlService} from '../../form/form-services/question-control.service';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.css']
})
export class ShowPageComponent implements OnInit, AfterViewInit {
  readonly showPageName;
  role;
  questions: QuestionBase<any>[];
  page = new Page({});
  template: string;
  payload: JSON;
  result = '';
  loadingContent = true;
  loadingViews = true;

  constructor(private titleService: Title,
              pds: PageDataService,
              jqf: JsonQuestionFormService,
              private qcs: QuestionControlService,
              private route: ActivatedRoute,
              private location: Location,
              private authService: AuthService) {
    this.showPageName = this.route.snapshot.paramMap.get('name');
    this.authService.getPageRole(this.showPageName).subscribe(data => this.role = data.body['role']);
    pds.getPageFromServer(this.showPageName).subscribe((data: any) => {
        data = data.body;
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
        this.loadingContent = false;
      },
      err => {
        console.log(err);
        alert(err.error.message);
        location.back();
      });
    titleService.setTitle(this.showPageName);
  }

  ngAfterViewInit() {
    // TODO: check if there is a way without delay
    (async () => {
      await this.delay(200);
      this.loadingViews = false;
    })();
  }


  ngOnInit(): void {
  }

  updatePayload(value: string) {
    if (value) {
      this.payload = JSON.parse(value);
      this.onSubmit();
    } else {
      this.payload = {} as JSON;
      this.result = '';
    }
  }

  onSubmit() {
    let translationDict = this.getTranslationDict();
    Object.keys(translationDict).forEach(key => {
      this.template = this.template.replace(key, translationDict[key]);
    });
    this.result = this.template.split('<br>').join('\n');
  }

  private getTranslationDict() {
    let translationDict = {};
    const names = this.getNamesToChange();
    names.forEach(name => {
      translationDict[name] = this.payload[this.qcs.labelToKey(name.substr(1, name.length - 2))];
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

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
