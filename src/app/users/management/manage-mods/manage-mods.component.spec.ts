import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageModsComponent } from './manage-mods.component';

describe('ManageModsComponent', () => {
  let component: ManageModsComponent;
  let fixture: ComponentFixture<ManageModsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageModsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
