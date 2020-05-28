import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Page} from '../Page';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../server-handlers/page-data.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';

@Component({
  selector: 'app-update-page-parent',
  templateUrl: './update-page-parent.component.html',
  styleUrls: ['./update-page-parent.component.css']
})
export class UpdatePageParentComponent implements OnInit {
  // template = 'template';
  // questionsForm = '{"questions": [ { "questionType": "dropBox", "questionName": "q1", "order": 0, "required": false, "questionLabels": { "forums": "asdasdas" } }, { "questionType": "textBox", "questionName": "q2", "order": 1, "required": false, "questionLabels": { "desc": "asdasd", "boxType": "number" } } ]}';
  // pageData = '{"name": "name", "color": "color", "title": "title", "about": "<p>about</p>", "remarks": [ "<p>r1</p>", "<p>r2</p>" ]}';
  template$: Observable<string>;
  questionsForm$: Observable<string>;
  pageData$: Observable<string>;
  private readonly showPageName;

  constructor(private titleService: Title, pds: PageDataService, jqf: JsonQuestionFormService, private route: ActivatedRoute) {
    this.showPageName = this.route.snapshot.paramMap.get('name');
    let self = this;
    pds.getPageFromServer(this.showPageName).subscribe((data: any) => {
      console.log('data from server: ' + JSON.stringify(data));
      self.pageData$ = of(JSON.stringify(new Page({
        name: data.name,
        color: data.color,
        title: data.title,
        about: data.about,
        remarks: data.remarks,
        showForm: data.showForm
      })));
      self.template$ = of(data.template);
      self.questionsForm$ = of(data.questions);
    });
    titleService.setTitle('Update ' + this.showPageName);
  }

  ngOnInit(): void {
  }

}
