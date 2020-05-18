import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../question-types/question-base';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {QuestionControlService} from '../form-services/question-control.service';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css'],
  providers: [QuestionControlService]
})
export class UpdateFormComponent implements OnInit {
  @Input() questions: QuestionBase<string>[];
  formForm: FormGroup;
  readonly maxOrder = 50;

  constructor(private fb: FormBuilder, private qcs: QuestionControlService) {
  }

  ngOnInit(): void {
    this.formForm = this.qcs.toFormFormGroup(this.questions);
  }

  addNewDropBoxQuestion() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: ['dropBox'],
        questionName: [''],
        order: this.getNextOrder(),
        required: false,
        questionLabels: this.fb.group({
          forums: ['']
        })
      })
    );
  }

  addNewTextBoxQuestion() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: 'textBox',
        questionName: [''],
        order: this.getNextOrder(),
        required: false,
        questionLabels: this.fb.group({
          desc: [''],
          boxType: ['']
        })
      })
    );
  }

  deleteQuestion(index) {
    let control = this.formForm.controls.questions as FormArray;
    control.removeAt(index);
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

  onUpdateFormSubmit() {
    // TODO: update on server side the current form
  }
}
