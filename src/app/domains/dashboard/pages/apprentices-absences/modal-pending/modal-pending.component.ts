import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { JustificationModel } from '@shared/models/justification-model';
import { JustificationsInstructorService } from '@shared/services/justifications-instructor.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-modal-pending',
  standalone: true,
  imports: [
    CommonModule, NzModalModule, NzButtonModule,FormsModule, NzIconModule
  ],
  templateUrl: './modal-pending.component.html',
  styleUrl: './modal-pending.component.css'
})
export class ModalPendingComponent {

 @Input() isVisible: boolean = false;
  @Input() justification!: JustificationModel;
  @Output() close = new EventEmitter<boolean>();
  @Output() statusChange = new EventEmitter<EstadoJustificacionEnum>();
  @Output() rejectionData = new EventEmitter<{ status: EstadoJustificacionEnum, motive: string }>();

  motive: string = ''; 
  charLimitExceededMotive: boolean = false;
  wordTooLongMotive: boolean = false;
  isMotiveRequired: boolean = false; // Para verificar si está vacío
  maxLength: number = 255;
  maxWordLength: number = 50; // Máximo de caracteres en una palabra
 

  isRejecting: boolean = false; 
  private justificationService = inject(JustificationsInstructorService);

  ngOnInit(): void {
    console.log(this.isVisible)
  }

  validateMotive() {
    if (!this.motive) {
      this.motive = ''; // Evita valores undefined
    }
  
    // 1️⃣ Verificar si hay palabras sin espacios demasiado largas
    const words = this.motive.split(/\s+/); // Divide el texto en palabras
    this.wordTooLongMotive = words.some(word => word.length > this.maxWordLength);
  
    // 2️⃣ Verificar si supera el límite total de caracteres
    if (this.motive.length > this.maxLength) {
      this.charLimitExceededMotive = true;
    } else {
      this.charLimitExceededMotive = false;
    }
  
    // 3️⃣ Verificar si el campo está vacío (requerido)
    this.isMotiveRequired = this.motive.trim().length === 0;
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
  
    this.rejectionData.emit({
      status: EstadoJustificacionEnum.RECHAZADO,
      motive: this.motive
    });
  
    this.close.emit(false);
  }
  
  closeModal(): void {
    this.close.emit(false);
    this.isRejecting = false;  
    this.motive = '';         
  }
  
}
