import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFormQuestionComponent } from './main-form-question.component';

describe('DynamicFormQuestionComponent', () => {
  let component: MainFormQuestionComponent;
  let fixture: ComponentFixture<MainFormQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFormQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFormQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
