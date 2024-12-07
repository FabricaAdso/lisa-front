import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExamineModalComponent } from './examine-modal/examine-modal.component';
import { ReviewModalComponent } from './review-modal/review-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CorrectModalComponent } from './correct-modal/correct-modal.component';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule, 
    NzTableModule, 
    NzButtonModule, 
    ExamineModalComponent, 
    ReviewModalComponent,
    CorrectModalComponent
  ],
  providers: [NzModalService],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css'
})
export class AbsencesComponent {

  constructor(private modal: NzModalService) {}

  onExamine(absence: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Detalles de la Inasistencia',
      nzContent: ExamineModalComponent,
      nzFooter: null,
    });
  
    // Pasar datos manualmente al componente del modal
    const instance = modalRef.getContentComponent() as ExamineModalComponent;
    instance.data = absence;
  }
   // Método para abrir el modal de Revisar
   onReview(absence: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Revisar Inasistencia',
      nzContent: ReviewModalComponent,
      nzOkText: 'Enviar',
      nzOnOk: () => console.log('Justificación enviada para:', absence),
    });
  
    const instance = modalRef.getContentComponent() as ReviewModalComponent;
    instance.data = absence;
  }
  onCorrect(absence: any): void {
    var habilitar:boolean = false;
    const modalRef = this.modal.create({
      nzTitle: 'Justificación Rechazada',
      nzContent: CorrectModalComponent,
      nzOkDisabled:habilitar,
      nzOkText:"Renviar",
      nzOnCancel:(item)=> console.log(item),
      nzOnOk: (item) =>  enviarDoc(),
    });
    const instance = modalRef.getContentComponent() as CorrectModalComponent;
    instance.data = absence
    instance.habilitar.subscribe((item:boolean)=>{
      habilitar=item;
    })

    function enviarDoc(){
      console.log(instance.selectedFile)
    }
  }

// Lista completa de inasistencias
absences = [
  { session: '2024-11-17', shift: '7:00 - 13:00', status: 'approved' },
  { session: '2024-11-18', shift: '7:00 - 13:00', status: 'pending' },
  { session: '2024-11-19', shift: '7:00 - 13:00', status: 'rejected' },
  { session: '2024-11-20', shift: '7:00 - 13:00', status: 'expired' },
];

// Lista filtrada por estado
filteredAbsences = this.absences;
activeFilter = 'all';




// Método para filtrar por estado
filterByStatus(status: string): void {

  this.activeFilter = status;
  if (status === 'all') {
    this.filteredAbsences = [...this.absences];
  } else {
    this.filteredAbsences = this.absences.filter(absence => absence.status == status);
    this.filteredAbsences = [...this.filteredAbsences]
  }
}
  
}