import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {QuestionControlService} from '../../form/form-services/question-control.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';
import {Utils} from '../../utilities/Utils';
import {PageDataService} from '../../server-handlers/page-data.service';

@Component({
  selector: 'app-update-page',
  templateUrl: './update-page.component.html',
  styleUrls: ['./update-page.component.css']
})
export class UpdatePageComponent implements OnInit {
  pageDataForm: FormGroup;
  formValue: string;
  totalValue: string;
  @Input() template: string;
  @Input() questionsForm: any;
  @Input() pageData: string;
  private oldName = '';
  jqfs = new JsonQuestionFormService(new QuestionControlService(this.fb));
  private pds: PageDataService;

  constructor(private fb: FormBuilder, pds: PageDataService) {
    this.pds = pds;
  }

  ngOnInit(): void {
    //console.log('pagedata: ' + this.pageData);
    let newPageData = JSON.parse(this.pageData);
    this.oldName = newPageData.name;
    this.pageDataForm = this.fb.group({
      name: [newPageData['name']],
      color: [newPageData['color']],
      title: [newPageData['title']],
      about: [newPageData['about']],
      remarks: this.fb.array([])
    });

    let control = this.pageDataForm.controls.remarks as FormArray;
    (Object.keys(newPageData['remarks'])).forEach(i => {
      control.push(this.fb.control(newPageData['remarks'][i]));
    });
  }

  onPageSubmit() {
    let formJsonValue = JSON.parse(this.formValue);
    this.totalValue = this.pageDataForm.getRawValue();
    this.totalValue['questions'] = formJsonValue.questions;
    if (formJsonValue.questions.length > 0) {
      this.totalValue['showForm'] = true;
    }
    this.totalValue['template'] = formJsonValue.template;
    this.totalValue = JSON.parse((JSON.stringify(this.totalValue))
      .split(Utils.DOUBLE_QUOTES)
      .join(Utils.DOUBLE_QUOTES_REPLACEMENT)
      .split(Utils.SINGLE_QUOTES)
      .join(Utils.SINGLE_QUOTES_REPLACEMENT)
    );

    // console.log(JSON.stringify(this.totalValue));
    this.pds.postUpdatePageToServer(this.oldName, this.totalValue).subscribe();
  }

  get remarks() {
    return this.pageDataForm.get('remarks') as FormArray;
  }

  addRemark() {
    this.remarks.push(this.fb.control(''));
  }

  deleteRemark(index) {
    let control = this.pageDataForm.controls.remarks as FormArray;
    control.removeAt(index);
  }

  updateFormValue(value: string) {
    this.formValue = value;
  }
}
