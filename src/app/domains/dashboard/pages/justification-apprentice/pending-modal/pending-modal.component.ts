import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JustificationModel } from '@shared/models/justification-model';
import { JustificationService } from '@shared/services/justification.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pending-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule,FormsModule],
  templateUrl: './pending-modal.component.html',
  styleUrl: './pending-modal.component.css'
})
export class PendingModalComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() justification!: JustificationModel; // Modelo de justificación para pasar datos
  @Output() close = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<JustificationModel>(); // Envía los datos actualizados al padre

  file_url?: string; // Archivo cargado (del modelo)
  description: string = ''; // Motivo ingresado
  errorMessage: string = ''; // Mensajes de error
  isLoading: boolean = false; // Estado de carga

  ngOnInit(): void {
    // Mapear los datos iniciales del modelo si está disponible
    if (this.justification) {
      this.file_url = this.justification.file_url || '';
      this.description = this.justification.description || '';
    }
  }

  handleFileInput(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      this.errorMessage = 'El archivo debe ser en formato PDF.';
      this.file_url = '';
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      this.errorMessage = 'El archivo no debe superar los 5MB.';
      this.file_url = '';
      return;
    }

    this.file_url = selectedFile.name; // Asigna el nombre del archivo
    this.errorMessage = '';
  }

  handleCancel(): void {
    this.close.emit(false); // Cierra el modal
  }

  handleSubmit(): void {
    if (!this.file_url) {
      this.errorMessage = 'Debe seleccionar un archivo antes de enviar.';
      return;
    }

    if (!this.description.trim()) {
      this.errorMessage = 'Debe ingresar un motivo.';
      return;
    }

    // Actualiza el modelo y lo envía al padre
    const updatedJustification: JustificationModel = {
      ...this.justification,
      file_url: this.file_url,
      description: this.description,
    };

    this.submit.emit(updatedJustification);

    this.close.emit(false); // Cierra el modal
  }

  
}

