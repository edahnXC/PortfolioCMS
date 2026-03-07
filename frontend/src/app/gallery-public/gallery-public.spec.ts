import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPublic } from './gallery-public';

describe('GalleryPublic', () => {
  let component: GalleryPublic;
  let fixture: ComponentFixture<GalleryPublic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryPublic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryPublic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
