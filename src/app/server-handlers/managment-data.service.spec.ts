import { TestBed } from '@angular/core/testing';

import { ManagementDataService } from './management-data.service';

describe('ManagmentDataService', () => {
  let service: ManagementDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
