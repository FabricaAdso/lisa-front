import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JustificationModell } from '@shared/models/justification-model';
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
  @Input() justification!: JustificationModell; // Recibe el objeto JustificationModelll completo
  @Output() close = new EventEmitter<boolean>(); // Notifica al padre que cierre el modal

  handleCancel(): void {
    this.close.emit(); // Emite el evento para cerrar el modal
  }

}
