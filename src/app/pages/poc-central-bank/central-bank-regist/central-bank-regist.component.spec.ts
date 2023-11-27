import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentralBankRegistComponent } from './central-bank-regist.component';


describe('CentralBankRegistComponent', () => {
  let component: CentralBankRegistComponent;
  let fixture: ComponentFixture<CentralBankRegistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CentralBankRegistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CentralBankRegistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
