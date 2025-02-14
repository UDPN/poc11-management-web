import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxLiquidityProviderComponent } from './fx-liquidity-provider.component';

describe('FxLiquidityProviderComponent', () => {
  let component: FxLiquidityProviderComponent;
  let fixture: ComponentFixture<FxLiquidityProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxLiquidityProviderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FxLiquidityProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
