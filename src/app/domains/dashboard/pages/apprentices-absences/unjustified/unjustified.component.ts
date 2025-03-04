import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JustificationModel } from '@shared/models/justification-model';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-unjustified',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
  ],
  templateUrl: './unjustified.component.html',
  styleUrl: './unjustified.component.css'
})
export class UnjustifiedComponent {


    @Input() isVisible: boolean = false; // Controla la visibilidad del modal
    @Input() justification!: JustificationModel; // Recibe la justificación seleccionada
    @Output() close = new EventEmitter<void>(); // Notifica al padre para cerrar el modal
  
    handleCancel(): void {
      this.close.emit(); // Emite el evento para cerrar el modal
    }

}
