import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpViewerComponent } from './xp-viewer.component';

describe('XpViewerComponent', () => {
  let component: XpViewerComponent;
  let fixture: ComponentFixture<XpViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XpViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XpViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
