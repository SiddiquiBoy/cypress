import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FixedHeaderComponent } from './fixed-header.component';

describe('FixedHeaderComponent', () => {
  let component: FixedHeaderComponent;
  let fixture: ComponentFixture<FixedHeaderComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
