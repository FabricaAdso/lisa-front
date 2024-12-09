
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
import { AssistanceService } from '@shared/services/assistance.service';
import { AssistanceModel } from '@shared/models/assistance.model';
import { JustificationModel } from '@shared/models/justificationModel';
import { JustificationAssistanceService } from '@shared/services/justification-assistance.service';
import { forkJoin } from 'rxjs';
import { ApprovedModel } from '@shared/models/aproved-model';
import { AprobationService } from '@shared/services/aprobation.service';
import { JustificationService } from '@shared/services/justification.service';
import { JustificationModell } from '@shared/models/justification-model';


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
    ExpiredModalComponent

  ],
  templateUrl: './justification-apprentice.component.html',
  styleUrl: './justification-apprentice.component.css',

})
export class JustificationApprenticeComponent {


  private assistanceService = inject(JustificationAssistanceService);
  private aprobationService = inject(AprobationService);
  private justificationService = inject(JustificationService);


  allData: AssistanceModel[] = []; // Datos de inasistencias
  filteredData: AssistanceModel[] = []; // Datos filtrados para la tabla
  aprobations: ApprovedModel[] = [];
  justifications: JustificationModell[] = [];


  ngOnInit(): void {
    this.loadInasistencias(); // Cargar las inasistencias al inicializar
  }
  loadInasistencias(): void {
    const datasub = forkJoin([

      this.justificationService.getAll({ included: ['assistance.session.instructor.user','aprobation','assistance.session.course'] }),

      // Cargar aprobaciones
      // this.aprobationService.getAprobations({
      //   included: ['justification', 'justification.assistance.session'],
      // }),


    ]).subscribe({
      next: ([justifications]) => {
        console.log('hola');
        
        console.log(justifications);
        this.justifications = justifications;
      }

    });

  }


  // Control de modal dinámico
  isModalVisible = false;
  selectedJustification!: JustificationModel; // Justificación seleccionada

  // filteredData1 = this.allData1;


  openModal(data: any): void {

    // this.selectedJustification = justification; 
    this.selectedJustification = {
      id: Math.floor(Math.random() * 100), // Generar un ID aleatorio como ejemplo
      fileName: 'archivo-demo.pdf', // Archivo de muestra
      reason: 'Motivo genérico.', // Motivo de muestra
      state: data.state, // Usar el estado del objeto original
      date: data.session, // Usar la sesión como fecha
      session: data.session,
      instructor: data.instructor,
      shift: data.shift,
    };

    this.isModalVisible = true;


  }
  // closeModal(data: boolean): void {
  //   this.isModalVisible = data;

  // }
  closeModal(): void {
    this.isModalVisible = false; // Cierra el modal
  }


  handleSubmission(data: { file: File; reason: string }): void {
    console.log('Archivo cargado:', data.file);
    console.log('Motivo:', data.reason);
    this.isModalVisible = false; // Cierra el modal después de la acción
  }



  // Cambiar entre pestañas y filtrar datos



  // onTabChange(index: number): void {
  //   const tabs = ['Inasistencias', 'Pendientes', 'Rechazadas', 'Aprobadas', 'Vencidas'];
  //   const selectedTab = tabs[index];

  //   if (selectedTab === 'Inasistencias') {
  //     this.filteredData = this.allData;
  //   } else {
  //     this.filteredData = this.allData.filter((data) => data.state === selectedTab);
  //   }

  // }


}
