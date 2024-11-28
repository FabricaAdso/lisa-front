import { CommonModule } from '@angular/common';
import { Component, Input,CUSTOM_ELEMENTS_SCHEMA, output, Output, EventEmitter } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-correct-modal',
  standalone: true,
  imports: [

    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './correct-modal.component.html',
  styleUrl: './correct-modal.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para permitir elementos personalizados
})
export class CorrectModalComponent {
  @Output() habilitar = new EventEmitter<boolean>(true)
  @Input() data: any;
  selectedFile: File | null = null;

  constructor(private modalRef: NzModalRef) {}

  ngOnInit(): void {
    console.log(this.data)
  }

  closeModal(): void {
    this.modalRef.close();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.habilitar.emit(false)
    }
  }

  submitJustification(): void {
    if (this.selectedFile) {
      console.log('Archivo enviado:', this.selectedFile);
      // Aquí puedes implementar la lógica para subir el archivo al servidor
      this.modalRef.close({ success: true });
    }
  }

}
