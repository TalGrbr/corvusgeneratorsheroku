import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Page} from '../Page';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageDataService} from '../../server-handlers/page-data.service';
import {Utils} from '../../utilities/Utils';
import {Router} from '@angular/router';
import {TakenValidator} from '../../utilities/custom-validators/taken-validator';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit, AfterViewInit {
  loadingEditor = true;
  page: Page;
  pageDataForm: FormGroup;
  formValue: string;
  totalValue: string;
  private pds: PageDataService;
  questionsAreValid = true;

  constructor(private fb: FormBuilder, pds: PageDataService, private router: Router) {
    this.pageDataForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ], [TakenValidator(pds, 'page name', '')]),
      color: [''],
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      about: new FormControl('', [
        Validators.maxLength(250)
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

  deleteRemark(index) {
    const control = this.pageDataForm.controls.remarks as FormArray;
    control.removeAt(index);
  }

  ngAfterViewInit() {
    this.loadingEditor = !document.getElementById('about').hasChildNodes();
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
    this.pds.postPageToServer(this.totalValue).subscribe(data => {
      alert(data['message']);
      this.router.navigate(['showPage/' + this.totalValue['name']]);
    }, error => {
      alert(error.error.message);
    });
  }

  updateFormValue(value: string) {
    this.formValue = value;
  }

  updateQuestionsValidation(isValid: boolean) {
    this.questionsAreValid = isValid;
  }
}
