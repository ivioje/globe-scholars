import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal-component';
import { provideRouter } from '@angular/router';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancelled on overlay click', () => {
    spyOn(component.cancelled, 'emit');
    component.onOverlayClick();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should emit confirmed on confirm', () => {
    spyOn(component.confirmed, 'emit');
    component.onConfirm();
    expect(component.confirmed.emit).toHaveBeenCalled();
  });
});
