import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-examine-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './examine-modal.component.html',
  styleUrl: './examine-modal.component.css'
})
export class ExamineModalComponent {

  @Input() data: any; // Recibe la inasistencia desde el componente padre
}
