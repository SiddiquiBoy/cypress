import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportScheduledComponent } from './report-scheduled.component';

describe('ReportScheduledComponent', () => {
  let component: ReportScheduledComponent;
  let fixture: ComponentFixture<ReportScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
