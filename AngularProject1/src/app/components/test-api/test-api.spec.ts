import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestApi } from './test-api';

describe('TestApi', () => {
  let component: TestApi;
  let fixture: ComponentFixture<TestApi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestApi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestApi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
