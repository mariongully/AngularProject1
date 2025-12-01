import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentList } from './instrument-list';

describe('InstrumentList', () => {
  let component: InstrumentList;
  let fixture: ComponentFixture<InstrumentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstrumentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
