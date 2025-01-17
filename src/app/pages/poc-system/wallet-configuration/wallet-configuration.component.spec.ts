import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletConfigurationComponent } from './wallet-configuration.component';

describe('WalletConfigurationComponent', () => {
  let component: WalletConfigurationComponent;
  let fixture: ComponentFixture<WalletConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletConfigurationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
