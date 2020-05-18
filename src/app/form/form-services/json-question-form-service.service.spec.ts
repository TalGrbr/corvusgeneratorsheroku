import { TestBed } from '@angular/core/testing';

import { JsonQuestionFormServiceService } from './json-question-form-service.service';

describe('JsonQuestionFormServiceService', () => {
  let service: JsonQuestionFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonQuestionFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
