import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  @Output() close = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<{ file: File; reason: string }>(); // Envía el archivo y el motivo al padre

  file: File | null = null; // Archivo cargado
  reason: string = ''; // Motivo ingresado
  errorMessage: string = ''; // Mensajes de error


  handleFileInput(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      this.errorMessage = 'El archivo debe ser en formato PDF.';
      this.file = null;
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      this.errorMessage = 'El archivo no debe superar los 5MB.';
      this.file = null;
      return;
    }

    this.file = selectedFile;
    this.errorMessage = '';
  }




  handleCancel(): void {
    this.resetModal(); // Limpia los datos
    this.close.emit(false); // Cierra el modal
  }

  handleSubmit(): void {
    if (!this.file) {
      this.errorMessage = 'Debe seleccionar un archivo antes de enviar.';
      return;
    }

    if (!this.reason.trim()) {
      this.errorMessage = 'Debe ingresar un motivo.';
      return;
    }

    // Envía los datos al padre
    this.submit.emit({ file: this.file, reason: this.reason });

    this.resetModal(); // Limpia el estado después de enviar
    this.close.emit(false); // Cierra el modal
  }

  resetModal(): void {
    this.file = null; // Limpia el archivo
    this.reason = ''; // Limpia el motivo
    this.errorMessage = ''; // Limpia los errores
  }


 


}
