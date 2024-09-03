/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GptService } from './gpt.service';

describe('Service: Gpt', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GptService]
    });
  });

  it('should ...', inject([GptService], (service: GptService) => {
    expect(service).toBeTruthy();
  }));
});
