
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PendingModalComponent } from './pending-modal/pending-modal.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { RejectedModalComponent } from './rejected-modal/rejected-modal.component';
import { ApprovedModalComponent } from './approved-modal/approved-modal.component';
import { ExpiredModalComponent } from './expired-modal/expired-modal.component';
import { AssistanceModel } from '@shared/models/assistance.model';
import { forkJoin } from 'rxjs';
import { ApprovedModel } from '@shared/models/aproved-model';
import { AprobationService } from '@shared/services/aprobation.service';
import { JustificationService } from '@shared/services/justification.service';
import { JustificationModel } from '@shared/models/justification-model';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { ThisReceiver } from '@angular/compiler';
import { ByEstadoJustificacionPipe } from '@shared/pipes/by-estado-justificacion.pipe';


@Component({
  selector: 'app-justification-apprentice',
  standalone: true,

  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTableModule,
    NzTabsModule,
    NzTabsModule,
    NzTagModule,
    PendingModalComponent,
    RejectedModalComponent,
    ApprovedModalComponent,
    ExpiredModalComponent,
    ByEstadoJustificacionPipe

  ],
  templateUrl: './justification-apprentice.component.html',
  styleUrl: './justification-apprentice.component.css',

})
export class JustificationApprenticeComponent {


  private justificationService = inject(JustificationService);

  justifications: JustificationModel[] = [];
  estadoJustificacion?:EstadoJustificacionEnum;
  estadoJustificacionEnum = EstadoJustificacionEnum;

    // Control de modal dinámico
    isModalVisible = false;
    isPendingModalVisible = false;
    
    selectedJustification!: JustificationModel; // datos de prueba
    filteredData = this.justifications;

  ngOnInit(): void {
    this.loadInasistencias(); // Cargar las inasistencias al inicializar
  }

  loadInasistencias(): void {
    const datasub = forkJoin([

      this.justificationService.getJustifications({ 
        included: ['assistance.session.instructor.user','aprobation','assistance.session.course'] 
      }),

    ]).subscribe({
      next: ([justifications]) => {
        console.log('hola');
        
        console.log(justifications);
        this.justifications = justifications;
        this.filteredData = [...this.justifications]; // Inicializa los datos filtrados
      }

    });

  }

  openModal(justification: JustificationModel): void {
     console.log('Justificación seleccionada:', justification);
    const state = justification.aprobation?.state ?? 'Pendiente';
    console.log('Estado:', state);

  // Normalizar el estado a 'Pendiente' si es null
  if (!justification.aprobation) {
    justification.aprobation = {state: EstadoJustificacionEnum.PENDIENTE,} as ApprovedModel;
    
  } else if (!justification.aprobation.state) {
    justification.aprobation.state = EstadoJustificacionEnum.PENDIENTE;
  }

    this.selectedJustification = justification;
    console.log(this.selectedJustification)
    this.isModalVisible = true;
  }


  closeModal(): void {
    this.isModalVisible = false; // Cierra el modal
  }


setEstadoJustificacion(estado?:EstadoJustificacionEnum){
  this.estadoJustificacion = estado;
}

handleSubmission(updatedJustification: JustificationModel): void {
  console.log(updatedJustification)
  this.justificationService.setJustificacion(updatedJustification).subscribe({
    next:(item:any)=>{
      console.log(item)
    },
    error:error =>{
      console.log(error)
    }
  })
  this.isModalVisible = false; 
}


}
