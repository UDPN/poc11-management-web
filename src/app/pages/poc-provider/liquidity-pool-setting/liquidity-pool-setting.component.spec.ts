import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquidityPoolSettingComponent } from './liquidity-pool-setting.component';

describe('LiquidityPoolSettingComponent', () => {
  let component: LiquidityPoolSettingComponent;
  let fixture: ComponentFixture<LiquidityPoolSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiquidityPoolSettingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiquidityPoolSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
