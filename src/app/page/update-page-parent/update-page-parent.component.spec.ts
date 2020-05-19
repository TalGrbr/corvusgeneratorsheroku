import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePageParentComponent } from './update-page-parent.component';

describe('UpdatePageParentComponent', () => {
  let component: UpdatePageParentComponent;
  let fixture: ComponentFixture<UpdatePageParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePageParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePageParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
