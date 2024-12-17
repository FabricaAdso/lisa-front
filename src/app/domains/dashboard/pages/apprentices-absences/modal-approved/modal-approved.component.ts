import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
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
  @Input() justification!: JustificationModel;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<'Aprobada'>(); // Emite el cambio de estado

  handleApprove(): void {
    this.statusChange.emit('Aprobada'); // Emite "Aprobada" al componente principal
    this.isVisible = false;
  }

  handleReject(): void {
    this.close.emit(); 
    this.isVisible = false;
  }
}
