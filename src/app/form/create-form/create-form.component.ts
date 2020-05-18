import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit {
  formForm: FormGroup;
  readonly maxOrder = 50;

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

  addEditor() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: 'bbCode',
        questionName: [''],
        order: this.getNextOrder(),
        required: false
      })
    );
  }

  deleteQuestion(index) {
    let control = this.formForm.controls.questions as FormArray;
    control.removeAt(index);
  }

  ngOnInit(): void {

  }

  formSubmitted() {
    // TODO: take data from form, from each question create question object and add it to an array
    // TODO: after having a full form, send it to the server to store it
    let formValue = this.formForm.value;
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
}
