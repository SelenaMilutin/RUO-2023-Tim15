import { TestBed } from '@angular/core/testing';

import { DinamoDBdataService } from './dinamo-dbdata.service';

describe('DinamoDBdataService', () => {
  let service: DinamoDBdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinamoDBdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
