import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunPanel } from './run-panel';

describe('RunPanel', () => {
  let component: RunPanel;
  let fixture: ComponentFixture<RunPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RunPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
