import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-expired',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
  ],
  templateUrl: './modal-expired.component.html',
  styleUrl: './modal-expired.component.css'
})
export class ModalExpiredComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<void>(); // Notifica al padre para cerrar el modal

  handleCancel(): void {
    this.close.emit(); // Cierra el modal al emitir el evento
  }

}
