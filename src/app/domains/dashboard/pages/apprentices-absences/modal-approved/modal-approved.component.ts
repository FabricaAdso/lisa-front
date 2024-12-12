import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JustificationModel } from '@shared/models/justification-model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-approved',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzIconModule
  ],
  templateUrl: './modal-approved.component.html',
  styleUrl: './modal-approved.component.css'
})
export class ModalApprovedComponent {
  @Input() isVisible: boolean = false; 
  @Input() justification!: JustificationModel; // Recibe el objeto JustificationModell completo
  @Output() close = new EventEmitter<boolean>(); // Notifica al padre que cierre el modal

  handleCancel(): void {
    this.close.emit(); // Emite el evento para cerrar el modal
  }

}
