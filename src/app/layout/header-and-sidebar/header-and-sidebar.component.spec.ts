import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderAndSidebarComponent } from './header-and-sidebar.component';

describe('HeaderAndSidebarComponent', () => {
  let component: HeaderAndSidebarComponent;
  let fixture: ComponentFixture<HeaderAndSidebarComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderAndSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderAndSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
