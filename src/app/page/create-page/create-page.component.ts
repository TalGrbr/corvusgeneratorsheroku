import {Component, OnInit} from '@angular/core';
import {Page} from '../Page';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageDataService} from '../../server-handlers/page-data.service';
import {Utils} from '../../utilities/Utils';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit {
  page: Page;
  pageDataForm: FormGroup;
  formValue: string;
  totalValue: string;
  private pds: PageDataService;
  questionsAreValid = false;

  constructor(private fb: FormBuilder, pds: PageDataService) {
    this.pageDataForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      color: [''],
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      about: new FormControl('', [
        Validators.maxLength(100)
      ]),
      remarks: this.fb.array([])
    });
    this.pds = pds;
  }

  get remarks() {
    return this.pageDataForm.get('remarks') as FormArray;
  }

  addRemark() {
    this.remarks.push(this.fb.control('', [Validators.maxLength(75), Validators.required]));
  }

  ngOnInit(): void {

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
    this.pds.postPageToServer(this.totalValue).subscribe(data => {
      alert(data['successBody']);
    }, error => {
      alert(error.error.errBody);
    });
  }

  updateFormValue(value: string) {
    this.formValue = value;
  }

  updateQuestionsValidation(isValid: boolean) {
    this.questionsAreValid = isValid;
  }
}
