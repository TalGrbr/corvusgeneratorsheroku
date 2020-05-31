import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Page} from '../Page';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../server-handlers/page-data.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';
import {Utils} from '../../utilities/Utils';

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
  readonly showPageName;

  constructor(private titleService: Title, pds: PageDataService, jqf: JsonQuestionFormService, private route: ActivatedRoute) {
    this.showPageName = this.route.snapshot.paramMap.get('name');
    let self = this;
    pds.getPageFromServer(this.showPageName).subscribe((data: any) => {
      //console.log('data from server: ' + JSON.stringify(data));
      data = data.body;
      self.pageData$ = of(JSON.stringify(new Page({
          name: data.name,
          color: data.color,
          title: data.title,
          about: data.about,
          remarks: data.remarks,
          showForm: data.showForm
        }))
          .split(Utils.DOUBLE_QUOTES_REPLACEMENT)
          .join(Utils.DOUBLE_QUOTES)
          .split(Utils.SINGLE_QUOTES_REPLACEMENT)
          .join(Utils.SINGLE_QUOTES)
      );
      self.template$ = of(data.template);
      self.questionsForm$ = of(JSON.parse(JSON.stringify(
            data.questions).split(Utils.DOUBLE_QUOTES_REPLACEMENT)
            .join(Utils.DOUBLE_QUOTES)
            .split(Utils.SINGLE_QUOTES_REPLACEMENT)
            .join(Utils.SINGLE_QUOTES)
        ));
    }, error => alert(error.error.message));
    titleService.setTitle('Update ' + this.showPageName);
  }

  ngOnInit(): void {
  }

}
