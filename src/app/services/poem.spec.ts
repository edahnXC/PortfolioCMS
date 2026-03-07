import { TestBed } from '@angular/core/testing';

import { Poem } from './poem';

describe('Poem', () => {
  let service: Poem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
