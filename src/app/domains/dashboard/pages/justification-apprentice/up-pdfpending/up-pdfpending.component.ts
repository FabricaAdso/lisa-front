import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-up-pdfpending',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
  ],
  templateUrl: './up-pdfpending.component.html',
  styleUrl: './up-pdfpending.component.css'
})
export class UpPDFPendingComponent {

  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<boolean>(); // Notifica al padre para cerrar el modal
  fileName: string = 'justificacion.pdf'; // Simulación del nombre del archivo subido
  justificationText: string = ''; // Justificación escrita por el usuario

  handleCancel(): void {
    this.close.emit(false); // Notifica al padre que cierre el modal
  }

  handleSubmit(): void {
    if (!this.justificationText.trim()) {
      alert('Debe ingresar una justificación antes de enviar.');
      return;
    }
    console.log('Justificación enviada:', this.justificationText);
    this.close.emit(false); // Cierra el modal al enviar
  }

}
