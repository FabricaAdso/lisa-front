import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-approved-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzIconModule
  ],
  templateUrl: './approved-modal.component.html',
  styleUrl: './approved-modal.component.css'
})
export class ApprovedModalComponent {

  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() fileName!: string; // Nombre del archivo subido por el aprendiz
  @Input() reason!: string; // Motivo cargado por el aprendiz

  @Output() close = new EventEmitter<boolean>(); // Notifica al padre que cierre el modal

  handleCancel(): void {
    this.close.emit(); // Emite el evento para cerrar el modal
  }

}
