import { TestBed } from '@angular/core/testing';

import { JsonQuestionFormService } from './json-question-form.service';

describe('JsonQuestionFormServiceService', () => {
  let service: JsonQuestionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonQuestionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
