import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePageUsersComponent } from './manage-page-users.component';

describe('ManagePageUsersComponent', () => {
  let component: ManagePageUsersComponent;
  let fixture: ComponentFixture<ManagePageUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePageUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
