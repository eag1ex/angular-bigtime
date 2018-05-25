import { TestBed, inject } from '@angular/core/testing';

import { ApiManagerService } from './api-manager.service';

describe('ApiManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiManagerService]
    });
  });

  it('should be created', inject([ApiManagerService], (service: ApiManagerService) => {
    expect(service).toBeTruthy();
  }));
});
