import { Component, inject } from '@angular/core';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { JustificationService } from '@shared/services/justification.service';
import { forkJoin } from 'rxjs';
import { ModalApprovedComponent } from "./modal-approved/modal-approved.component";
import { ByEstadoJustificacionPipe } from '@shared/pipes/by-estado-justificacion.pipe';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ModalPendingComponent } from "./modal-pending/modal-pending.component";
import { ModalRejectedComponent } from "./modal-rejected/modal-rejected.component";
import { ModalExpiredComponent } from "./modal-expired/modal-expired.component";
import { JustificationModel } from '@shared/models/justification-model';
import { JustificationsInstructorService } from '@shared/services/justifications-instructor.service';

@Component({
  selector: 'app-apprentices-absences',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTableModule,
    NzTabsModule,
    NzTabsModule,
    NzTagModule,
    ModalApprovedComponent,
    ModalPendingComponent,
    ModalRejectedComponent,
    ModalExpiredComponent
],
  templateUrl: './apprentices-absences.component.html',
  styleUrl: './apprentices-absences.component.css'
})
export class ApprenticesAbsencesComponent {
  private justificationService = inject(JustificationsInstructorService);

  justifications: JustificationModel[] = [];
  estadoJustificacion?:EstadoJustificacionEnum;
  estadoJustificacionEnum = EstadoJustificacionEnum;

    // Control de modal dinámico
    isModalVisible = false;
    selectedJustification!: JustificationModel; // datos de prueba
    filteredData = this.justifications;

  ngOnInit(): void {
    this.loadInasistencias(); // Cargar las inasistencias al inicializar
  }

  loadInasistencias(): void {
    const datasub = forkJoin([
      this.justificationService.getJustifications({
        included: ['assistance.session.instructor.user', 'aprobation', 'assistance.session.course','assistance.apprentice.user']
      })
    ]).subscribe({
      next: ([justifications]) => {
        console.log('Justificaciones cargadas:', justifications);
        this.justifications = justifications;
        this.filteredData = [...this.justifications]; // Inicializa los datos filtrados
      },
      error: (err) => {
        console.error('Error al cargar las justificaciones:', err);
      }
    });
  } 

  openModal(justification: JustificationModel): void {
    console.log('Justificación seleccionada:', justification);
    this.selectedJustification = justification;
    this.isModalVisible = true;
  }
  closeModal(): void {
    this.isModalVisible = false; // Cierra el modal
  }


  handleSubmission(data: { file: File; reason: string }): void {
    console.log('Archivo cargado:', data.file);
    console.log('Motivo:', data.reason);
    this.isModalVisible = false; // Cierra el modal después de la acción
  }



  // Cambiar entre pestañas y filtrar datos

onTabChange(index: number): void {
  const tabs = ['Inasistencias', 'Pendientes', 'Rechazadas', 'Aprobadas', 'Vencidas'];
  const selectedTab = tabs[index];

  if (selectedTab === 'Inasistencias') {
    // Muestra todas las justificaciones
    this.filteredData = this.justifications;
  } else if (selectedTab === 'Pendientes') {
    // Filtra aquellas sin aprobación (state null o undefined)
    this.filteredData = this.justifications.filter(
      (data) => !data.aprobation?.state
    );
  } else {
    // Filtra por estado específico
    this.filteredData = this.justifications.filter(
      (data) => data.aprobation?.state === selectedTab
    );
  }
}

setEstadoJustificacion(estado?:EstadoJustificacionEnum){
  this.estadoJustificacion = estado;
}


}
