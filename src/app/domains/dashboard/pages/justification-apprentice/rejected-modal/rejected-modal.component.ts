import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JustificationModel } from '@shared/models/justification-model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-rejected-modal',
  standalone: true,
  imports: [

    CommonModule, 
    NzModalModule, 
    NzButtonModule, 
    NzIconModule
  ],
  templateUrl: './rejected-modal.component.html',
  styleUrl: './rejected-modal.component.css'
})
export class RejectedModalComponent {


  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<boolean>(); // Para cerrar el modal desde el padre

  @Input() justification!: JustificationModell; // rrecibe el objeto de justificación



  handleCancel(): void {
    this.close.emit(false); // Notifica al padre que cierre el modal
  }

}
