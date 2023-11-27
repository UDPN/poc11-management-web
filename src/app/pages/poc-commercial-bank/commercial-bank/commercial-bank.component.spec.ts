import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercialBankComponent } from './commercial-bank.component';

describe('CommercialBankComponent', () => {
  let component: CommercialBankComponent;
  let fixture: ComponentFixture<CommercialBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommercialBankComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommercialBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
