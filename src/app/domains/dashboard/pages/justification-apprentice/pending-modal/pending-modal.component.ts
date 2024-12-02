import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JustificationModel } from '@shared/models/justificationModel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pending-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule],
  templateUrl: './pending-modal.component.html',
  styleUrl: './pending-modal.component.css'
})
export class PendingModalComponent {

  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<boolean>();
  @Output() openSecondModal = new EventEmitter<void>(); // Notifica al padre para abrir el segundo modal




  handleCancel(): void {
    this.close.emit(false); // Cierra el modal
  }
  handleOpenSecondModal(): void {
    this.openSecondModal.emit(); // Notifica al padre que abra el segundo modal
  }


}
