import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit {
  formForm: FormGroup;
  readonly maxOrder = 50;
  template: string;
  @Output() contentEvent = new EventEmitter<string>();
  @Output() validationEvent = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    this.formForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  addNewDropBoxQuestion() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: ['dropBox'],
        questionName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]),
        desc: new FormControl('', [
          Validators.maxLength(30)
        ]),
        order: this.getNextOrder(),
        required: false,
        questionLabels: this.fb.group({
          values: new FormControl(''),
          keys: new FormControl('')
        })
      })
    );
    this.validationEvent.emit(this.formForm.valid);
  }

  addNewTextBoxQuestion() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: 'textBox',
        questionName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]),
        order: this.getNextOrder(),
        required: false,
        desc: new FormControl('', [
          Validators.maxLength(30)
        ]),
        questionLabels: this.fb.group({
          boxType: new FormControl('', [
            Validators.required
          ])
        })
      })
    );
    this.validationEvent.emit(this.formForm.valid);
  }

  addEditor() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: 'bbCode',
        questionName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]),
        desc: new FormControl('', [
          Validators.maxLength(30)
        ]),
        order: this.getNextOrder(),
        required: false
      })
    );
    this.validationEvent.emit(this.formForm.valid);
  }

  deleteQuestion(index) {
    let control = this.formForm.controls.questions as FormArray;
    control.removeAt(index);
  }

  ngOnInit(): void {

  }

  updateTemplate(value: string) {
    this.template = value;
    this.formForm.value['template'] = this.template;
    this.updateQuestionsKeys();
    this.validationEvent.emit(this.formForm.valid);
    this.contentEvent.emit(JSON.stringify(this.formForm.value));
  }

  getFormOrders() {
    let orders = new Array<number>();
    let formValue = this.formForm.get('questions').value;
    formValue.forEach(element => {
      orders.push(+element.order);
    });
    return orders;
  }

  getNextOrder() {
    let orders = this.getFormOrders();

    for (let i in this.range(0, this.maxOrder)) {
      if (!orders.includes(+i)) {
        return +i;
      }
    }
  }

  range(start, end) {
    if (start === end) {
      return [start];
    }
    return [start, ...this.range(start + 1, end)];
  }

  formChanged() {
    this.formForm.value['template'] = this.template;
    this.updateQuestionsKeys();
    this.contentEvent.emit(JSON.stringify(this.formForm.value));
    this.validationEvent.emit(this.formForm.valid);
    //alert(JSON.stringify(this.formForm.value));
  }

  private updateQuestionsKeys() {
    let formValue = this.formForm.value;
    let questions = formValue.questions;
    questions.forEach(q => {
      q['key'] = q['order'].toString();
    });
  }
}
