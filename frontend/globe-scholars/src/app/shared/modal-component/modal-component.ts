import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-component',
  imports: [RouterLink],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.scss',
})
export class ModalComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmLabel = '';
  @Input() confirmLink = '';
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  onOverlayClick() {
    this.cancelled.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }

  onConfirm() {
    this.confirmed.emit();
  }
}
