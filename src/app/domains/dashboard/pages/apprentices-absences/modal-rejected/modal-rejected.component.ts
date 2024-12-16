import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JustificationModel } from '@shared/models/justification-model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-rejected',
  standalone: true,
  imports: [
    CommonModule, 
    NzModalModule, 
    NzButtonModule, 
    NzIconModule
  ],
  templateUrl: './modal-rejected.component.html',
  styleUrl: './modal-rejected.component.css'
})
export class ModalRejectedComponent {
  @Input() isVisible: boolean = false; 
  @Output() close = new EventEmitter<boolean>(); 
  @Input() justification!: JustificationModel; 



  handleCancel(): void {
    this.close.emit(false); // Notifica al padre que cierre el modal
  }
}
