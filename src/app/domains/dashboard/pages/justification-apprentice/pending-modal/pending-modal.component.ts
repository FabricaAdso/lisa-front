import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JustificationModel } from '@shared/models/justification-model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pending-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule,FormsModule,NzIconModule],
  templateUrl: './pending-modal.component.html',
  styleUrl: './pending-modal.component.css'
})
export class PendingModalComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() justification!: JustificationModel; // Modelo de justificación para pasar datos
  @Output() close = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<JustificationModel>(); // Envía los datos actualizados al padre


  file!: File; // Archivo seleccionado
  file_url?: string; // Archivo cargado (del modelo)
  description: string = ''; 
  errorMessage: string = ''; // Mensajes de error
  isLoading: boolean = false; // Estado de carga

  ngOnInit(): void {
    console.log(this.justification)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      // Se abrió el modal, resetear estados
      this.resetForm();
    }
  }
  
  resetForm(): void {
    this.file = undefined!;
    this.errorMessage = '';
    this.isLoading = false;
  
   
    if (this.justification) {
      this.justification.description = this.justification.description || '';
    }
  }

  


  handleFileInput(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    if (selectedFile.type !== 'application/pdf') {
      this.errorMessage = 'El archivo debe ser en formato PDF.';
      this.file = undefined!;
      return;
    }
  
    if (selectedFile.size > 5 * 1024 * 1024) {
      this.errorMessage = 'El archivo no debe superar los 5MB.';
      this.file = undefined!;
      return;
    }
  
    this.file = selectedFile; // Almacena el archivo seleccionado
    this.errorMessage = '';

      // Previsualización del icono PDF
    this.file_url = URL.createObjectURL(this.file); // Genera la URL del archivo
  }

  handleCancel(): void {
    this.close.emit(false); // Cierra el modal
  }
  handleSubmit(): void {
    if (!this.file) {
      this.errorMessage = 'Debe seleccionar un archivo antes de enviar.';
      return;
    }
  
    if (!this.justification.description?.trim()) {
      this.errorMessage = 'Debe ingresar una descripcion.';
      return;
    }
  
    const updatedJustification: JustificationModel = {
      ...this.justification,
      file: this.file,
      description: this.justification.description
    };
  
    // Emitir los datos al padre
    this.submit.emit(updatedJustification);
  
    // Cerrar el modal
    this.handleCancel();
  }
  

  
}

