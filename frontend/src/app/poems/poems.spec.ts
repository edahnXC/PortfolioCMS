import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poems } from './poems';

describe('Poems', () => {
  let component: Poems;
  let fixture: ComponentFixture<Poems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Poems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Poems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
