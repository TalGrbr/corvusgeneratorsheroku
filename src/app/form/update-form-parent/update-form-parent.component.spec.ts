import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFormParentComponent } from './update-form-parent.component';

describe('UpdateFormPageComponent', () => {
  let component: UpdateFormParentComponent;
  let fixture: ComponentFixture<UpdateFormParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFormParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFormParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
