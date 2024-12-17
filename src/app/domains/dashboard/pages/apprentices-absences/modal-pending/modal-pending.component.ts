import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { JustificationModel } from '@shared/models/justification-model';
import { JustificationsInstructorService } from '@shared/services/justifications-instructor.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-pending',
  standalone: true,
  imports: [
    CommonModule, NzModalModule, NzButtonModule,FormsModule
  ],
  templateUrl: './modal-pending.component.html',
  styleUrl: './modal-pending.component.css'
})
export class ModalPendingComponent {

 @Input() isVisible: boolean = false;
  @Input() justification!: JustificationModel;
  @Output() close = new EventEmitter<boolean>();
  @Output() statusChange = new EventEmitter<EstadoJustificacionEnum>();
  motive: string = ''; 
  isRejecting: boolean = false; 
  private justificationService = inject(JustificationsInstructorService);

  ngOnInit(): void {
    console.log(this.isVisible)
  }

  handleApprove(): void {
    this.statusChange.emit(EstadoJustificacionEnum.APROBADO); 
    this.isVisible = false;
  }
  
  handleReject(): void {
    this.isRejecting = true; 
  }
  sendRejection(): void {
    if (this.motive.trim() === '') {
      alert('Por favor ingresa el motivo del rechazo.');
      return;
    }
    this.statusChange.emit(EstadoJustificacionEnum.RECHAZADO);
    this.close.emit();
    this.isVisible = false;
    this.justificationService.updateJustificationStatus(this.justification.id, EstadoJustificacionEnum.RECHAZADO, this.motive)
      .subscribe({
        next: (response) => {
          console.log('Justificación rechazada con motivo:', this.motive);
        },
        error: (err) => {
          console.error('Error al actualizar la justificación:', err);
        }
      });
  }
  
  closeModal(): void {
    this.close.emit(false);
    this.isRejecting = false;  
    this.motive = '';         
  }
  
}
