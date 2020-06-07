import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePageAdminComponent } from './manage-page-admin.component';

describe('ManagePageAdminComponent', () => {
  let component: ManagePageAdminComponent;
  let fixture: ComponentFixture<ManagePageAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePageAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
