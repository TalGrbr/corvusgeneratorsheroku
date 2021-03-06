import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Page} from '../Page';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../server-handlers/page-data.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';
import {Utils} from '../../utilities/Utils';
import {AuthService} from '../../users/Auth/auth.service';
import {ToastService} from '../../logging/toast.service';

@Component({
  selector: 'app-update-page-parent',
  templateUrl: './update-page-parent.component.html',
  styleUrls: ['./update-page-parent.component.css']
})
export class UpdatePageParentComponent implements OnInit {
  template$: Observable<string>;
  questionsForm$: Observable<string>;
  pageData$: Observable<string>;
  readonly showPageName;
  role;
  loadingContent = true;

  constructor(private titleService: Title,
              pds: PageDataService,
              jqf: JsonQuestionFormService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private toastService: ToastService) {
    this.showPageName = this.route.snapshot.paramMap.get('name');
    authService.getPageRole(this.showPageName).subscribe(data => this.role = data.body['role']);
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
      );
      self.template$ = of(data.template);
      self.questionsForm$ = of(JSON.parse(JSON.stringify(
        data.questions)
      ));
      this.loadingContent = false;
    }, error => this.toastService.showDanger(error.error.message));
    titleService.setTitle('Update ' + this.showPageName);
  }

  ngOnInit(): void {
  }

}
