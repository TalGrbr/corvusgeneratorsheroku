import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionControlService} from '../../form/form-services/question-control.service';
import {JsonQuestionFormService} from '../../form/form-services/json-question-form.service';
import {Utils} from '../../utilities/Utils';
import {PageDataService} from '../../server-handlers/page-data.service';
import {Router} from '@angular/router';
import {TakenValidator} from '../../utilities/custom-validators/taken-validator';

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
  @Input() role: string;
  private oldName = '';
  curName = this.oldName;
  jqfs = new JsonQuestionFormService(new QuestionControlService(this.fb));
  questionsAreValid = true;

  constructor(private fb: FormBuilder, private pds: PageDataService, private router: Router) {
  }

  ngOnInit(): void {
    // console.log('pagedata: ' + this.pageData);
    let newPageData = JSON.parse(this.pageData);
    this.oldName = newPageData.name;
    this.curName = this.oldName;
    this.pageDataForm = this.fb.group({
      name: [newPageData['name'], [Validators.required], [TakenValidator(this.pds, 'page name', this.oldName)]],
      color: [newPageData['color']],
      title: [newPageData['title'], [Validators.required]],
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
   /* this.totalValue = JSON.parse((JSON.stringify(this.totalValue))
      .split(Utils.DOUBLE_QUOTES_ESCAPED)
      .join(Utils.DOUBLE_QUOTES_REPLACEMENT)
      .split(Utils.SINGLE_QUOTES)
      .join(Utils.SINGLE_QUOTES_REPLACEMENT)
    );*/

    // console.log(JSON.stringify(this.totalValue));
    this.pds.postUpdatePageToServer(this.oldName, this.totalValue).subscribe(data => {
      alert(data['message']);
      this.curName = this.totalValue['name'];
    }, error => {
      alert(error.error.message);
    });
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

  deleteClicked() {
    this.pds.postDeletePageToServer(this.curName).subscribe(data => {
      alert(data['message']);
      this.router.navigate(['choosePage']);
    }, error => alert(error.error.message));
  }

  updateQuestionsValidation(isValid: boolean) {
    this.questionsAreValid = isValid;
  }

  isVisible(roles) {
    return roles.includes(this.role);
  }
}
