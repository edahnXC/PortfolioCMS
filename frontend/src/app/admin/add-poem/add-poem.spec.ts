import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoem } from './add-poem';

describe('AddPoem', () => {
  let component: AddPoem;
  let fixture: ComponentFixture<AddPoem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPoem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPoem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
