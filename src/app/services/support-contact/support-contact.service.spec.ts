import { TestBed } from '@angular/core/testing';

import { SupportContactService } from './support-contact.service';

describe('SupportContactService', () => {
  let service: SupportContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
