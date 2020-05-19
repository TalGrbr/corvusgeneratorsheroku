import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {QuestionControlService} from '../../form/form-services/question-control.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';

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
  @Input() questionsForm: string;
  @Input() pageData: string;
  jqfs = new JsonQuestionFormService(new QuestionControlService(this.fb));

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    let newPageData = JSON.parse(this.pageData);
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
    this.totalValue['template'] = formJsonValue.template;
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
