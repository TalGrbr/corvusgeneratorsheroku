import {Component, OnInit} from '@angular/core';
import {Page} from '../Page';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.pageDataForm = this.fb.group({
      name: [''],
      color: [''],
      title: [''],
      about: [''],
      remarks: this.fb.array([
        this.fb.control('')
      ])
    });
  }

  get remarks() {
    return this.pageDataForm.get('remarks') as FormArray;
  }

  addRemark() {
    this.remarks.push(this.fb.control(''));
  }

  ngOnInit(): void {

  }

  onPageSubmit() {
    let formJsonValue = JSON.parse(this.formValue);
    this.totalValue = this.pageDataForm.getRawValue();
    this.totalValue['questions'] = formJsonValue.questions;
    this.totalValue['template'] = formJsonValue.template;

    //TODO send this to server
  }

  updateFormValue(value: string) {
    this.formValue = value;
  }
}
