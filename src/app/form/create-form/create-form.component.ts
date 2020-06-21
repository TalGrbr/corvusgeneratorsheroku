import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  animations: [
    trigger('smoothCollapse', [
      state('initial', style({
        height: 0,
        width: 0,
        'padding-top': '0',
        'padding-bottom': '0',
        overflow: 'hidden',
        opacity: 0
      })),
      state('final', style({
        overflow: 'hidden',
        opacity: 1
      })),
      transition('initial=>final', animate('275ms')),
      transition('final=>initial', animate('275ms'))
    ]),
  ]
})
export class CreateFormComponent implements OnInit {
  formForm: FormGroup;
  readonly maxOrder = 50;
  template: string;
  @Output() contentEvent = new EventEmitter<string>();
  @Output() validationEvent = new EventEmitter<boolean>();
  isCollapsed = -1;

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
          Validators.maxLength(30),
          Validators.required
        ]),
        order: new FormControl(this.getNextOrder(), [Validators.required]),
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

  addThreadsGenerator() {
    let control = this.formForm.controls.questions as FormArray;
    control.push(
      this.fb.group({
        questionType: 'threads',
        questionName: new FormControl('', [Validators.required]),
        desc: new FormControl(''),
        order: -1,
        required: false,
        questionLabels: this.fb.group({
          forumId: new FormControl('', [
            Validators.required,
            Validators.pattern(/[0-9]+/)
          ])
        })
      })
    );
  }

  deleteQuestion(index) {
    let control = this.formForm.controls.questions as FormArray;
    control.removeAt(index);
    this.validationEvent.emit(this.formForm.valid);
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

  setCollapsed(index) {
    (this.isCollapsed === index) ? this.isCollapsed = -1 : this.isCollapsed = index;
  }
}
