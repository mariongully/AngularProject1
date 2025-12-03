import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunQueue } from './run-queue';

describe('RunQueue', () => {
  let component: RunQueue;
  let fixture: ComponentFixture<RunQueue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RunQueue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunQueue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
