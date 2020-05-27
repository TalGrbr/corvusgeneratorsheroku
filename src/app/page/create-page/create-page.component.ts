import {Component, OnInit} from '@angular/core';
import {Page} from '../Page';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PageDataService} from '../../server-handlers/page-data.service';

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


  constructor(private fb: FormBuilder, pds: PageDataService) {
    this.pageDataForm = this.fb.group({
      name: [''],
      color: [''],
      title: [''],
      about: [''],
      remarks: this.fb.array([
        this.fb.control('')
      ])
    });
    this.pds = pds;
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
    if (formJsonValue.questions.length > 0) {
      this.totalValue['showForm'] = true;
    }
    this.totalValue['template'] = formJsonValue.template;

    this.pds.postPageToServer(this.totalValue).subscribe();
  }

  updateFormValue(value: string) {
    this.formValue = value;
  }
}
