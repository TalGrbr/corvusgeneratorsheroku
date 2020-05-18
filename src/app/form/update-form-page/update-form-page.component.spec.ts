import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFormPageComponent } from './update-form-page.component';

describe('UpdateFormPageComponent', () => {
  let component: UpdateFormPageComponent;
  let fixture: ComponentFixture<UpdateFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
