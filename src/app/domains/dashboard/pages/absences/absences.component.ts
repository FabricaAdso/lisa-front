import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css'
})
export class AbsencesComponent {

  absences = [
    { session: '2024-11-17', shift: '7:00 - 13:00', status: 'approved' },
    { session: '2024-11-18', shift: '7:00 - 13:00', status: 'pending' },
    { session: '2024-11-19', shift: '7:00 - 13:00', status: 'rejected' },
    { session: '2024-11-20', shift: '7:00 - 13:00', status: 'expired' },
  ];

  onExamine(absence: any): void {
    console.log('Examining', absence);
    // Lógica para modal de examinar
  }

  onReview(absence: any): void {
    console.log('Reviewing', absence);
    // Lógica para modal de revisar
  }
}
