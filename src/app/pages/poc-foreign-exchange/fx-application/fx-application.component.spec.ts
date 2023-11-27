import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxApplicationComponent } from './fx-application.component';


describe('FxApplicationComponent', () => {
  let component: FxApplicationComponent;
  let fixture: ComponentFixture<FxApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FxApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
