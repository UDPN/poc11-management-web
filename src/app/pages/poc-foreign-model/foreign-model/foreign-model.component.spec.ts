import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForeignModelComponent } from './foreign-model.component';

describe('ForeignModelComponent', () => {
  let component: ForeignModelComponent;
  let fixture: ComponentFixture<ForeignModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForeignModelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForeignModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
