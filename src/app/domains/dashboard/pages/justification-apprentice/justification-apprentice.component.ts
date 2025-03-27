
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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

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
    NzPaginationModule
    

  ],
  templateUrl: './justification-apprentice.component.html',
  styleUrl: './justification-apprentice.component.css',

})
export class JustificationApprenticeComponent {


  private justificationService = inject(JustificationService);
  isInasistencias: boolean = true;
  justifications: JustificationModel[] = [];
  estadoJustificacion?: EstadoJustificacionEnum;
  estadoJustificacionEnum = EstadoJustificacionEnum;
  isLoading: boolean = false; 

  isModalVisible = false;
  isPendingModalVisible = false;
  selectedJustification!: JustificationModel; 
  filteredData: JustificationModel[] = []; 

  elements: number = 9;
  page: number = 1;
  last_page: number = 0;
  total_elements: number = 0;
  page_options: number[] = [];

  
  included: string[] = ['assistance.session.instructor.user', 'aprobation', 'assistance.session.course'];
  activeTabClass = 'inasistencias'; // Estado inicial
  filter?: { [key: string]: string | EstadoJustificacionEnum };



  ngOnInit(): void {
    this.loadInasistencias(); // Cargar las inasistencias al inicializar

    // Recuperar datos de LocalStorage
    const savedData = localStorage.getItem('justificationData');
    if (savedData) {
      this.selectedJustification = JSON.parse(savedData);
    }
  }


  loadInasistencias(): void {
    const datasub = forkJoin([
      this.justificationService.getJustifications({
        included: this.included,
        page: this.page,
        elements: this.elements,
      }),

    ]).subscribe({
      next: ([justifications]) => {
        console.log(justifications);
        const { data, per_page, current_page, last_page, total } = justifications;
        this.setPage(current_page, per_page, last_page, total);
        this.justifications = [...data];
        console.log(data);
        
        
      },
      error: (err) => {
        console.error('Error al cargar las justificaciones:', err);
      },

    });

  }
  setPage(
    current_page: number,
    per_page: number,
    last_page: number,
    total: number
  ): void {
    this.page = current_page;
    this.elements = per_page;
    this.last_page = last_page; 
    this.total_elements = total;

    this.page_options = Array.from({ length: last_page }, (_, i) => i + 1);
  }
  changePage(page: number) {
    console.log(page);
    this.justificationService
      .getJustifications({
        included: this.included,
        filter: this.filter,
        page: page,
        elements: this.elements,
      })
      .subscribe({
        next: (justifications) => {
          const {
            data,
            per_page,
            current_page,
            last_page,
            total: to,
          } = justifications;
          console.log(data);
          this.setPage(current_page, per_page, last_page, to);
          this.justifications = [...data];
        },
      });
  }

  getFilterJustificacion(filter?: { [key: string]: string | EstadoJustificacionEnum }) {
    this.filter = filter;
    this.changePage(1);

    // Si el filtro tiene 'aprobationState', ajusta el valor de isInasistencias.
    if (filter && filter['aprobationState'] !== EstadoJustificacionEnum.VENCIDA) {
        this.isInasistencias = false;
    } else {
        this.isInasistencias = true;
    }
}



  setActiveTab(tab: string) {
    this.activeTabClass = tab;
  }

  getEstadoClass(estado: string | null | undefined): string {
    if (!estado) return 'estado-pendiente'; // Default a 'Pendiente'
  
    switch (estado) {
      case this.estadoJustificacionEnum.PENDIENTE:
        return 'estado-pendiente';
      case this.estadoJustificacionEnum.RECHAZADO:
        return 'estado-rechazado';
      case this.estadoJustificacionEnum.APROBADO:
        return 'estado-aprobado';
      case this.estadoJustificacionEnum.VENCIDA:
        return 'estado-vencida';
      case this.estadoJustificacionEnum.EN_ESPERA:
        return 'estado-en-espera';  
      default:
        return 'estado-inasistencia';
    }
  }

  setEstadoJustificacion(estado?: EstadoJustificacionEnum) {
    this.estadoJustificacion = estado;
  }

  

  openModal(justification: JustificationModel): void {
    console.log('Justificación seleccionada:', justification);
    const state = justification.aprobation?.state ?? 'Pendiente';
    console.log('Estado:', state);

    // Normalizar el estado a 'Pendiente' si es null
    if (!justification.aprobation) {
      justification.aprobation = { state: EstadoJustificacionEnum.PENDIENTE, } as ApprovedModel;

    } else if (!justification.aprobation.state) {
      justification.aprobation.state = EstadoJustificacionEnum.PENDIENTE;
    }

    this.selectedJustification = justification;
    this.isModalVisible = true;
  }


  closeModal(): void {
    this.isModalVisible = false; // Cierra el modal
  }




  handleSubmission(updatedJustification: JustificationModel): void {
    this.isLoading = true; // Indicar que la solicitud está en curso

    this.justificationService.setJustificacion(updatedJustification, { included: this.included }).subscribe({
      next: (response: JustificationModel) => {
        this.isLoading = false; // Finalizar el estado de carga

        // Actualizar la lista de justificaciones
        const index = this.justifications.findIndex((j) => j.id == updatedJustification.id);
        console.log('el indeeex', index);
        if (index > -1) {
          let justifications = this.justifications;
          justifications[index] = response;
          console.log(response);

          this.justifications = [...justifications];
        }

        // Actualizar el modelo seleccionado
        this.selectedJustification = response;

        // Guardar en LocalStorage
        localStorage.setItem('justificationData', JSON.stringify(response));

        // Cerrar el modal
        this.isModalVisible = false;
      },
      error: (err) => {
        this.isLoading = false; // Finalizar el estado de carga
        console.error('Error al enviar la justificación:', err);
      }
    });
  }



}
