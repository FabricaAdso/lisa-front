import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.css'
})
export class ReviewModalComponent {
  @Input() data: any; // Recibe los datos del padre

}
