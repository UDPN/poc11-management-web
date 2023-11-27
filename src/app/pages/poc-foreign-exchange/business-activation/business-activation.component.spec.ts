import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessActivationComponent } from './business-activation.component';


describe('BusinessActivationComponent', () => {
  let component: BusinessActivationComponent;
  let fixture: ComponentFixture<BusinessActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessActivationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
