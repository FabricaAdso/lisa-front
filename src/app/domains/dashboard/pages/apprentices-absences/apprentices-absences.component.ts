import { Component, inject } from '@angular/core';
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
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

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
    ModalExpiredComponent,
    NzPaginationModule
],
  templateUrl: './apprentices-absences.component.html',
  styleUrl: './apprentices-absences.component.css'
})
export class ApprenticesAbsencesComponent {
  private justificationService = inject(JustificationsInstructorService);

  isInasistencias: boolean = true;
  justifications: JustificationModel[] = [];
  estadoJustificacion?:EstadoJustificacionEnum;
  estadoJustificacionEnum = EstadoJustificacionEnum;

  isModalVisible = false;
  selectedJustification!: JustificationModel; 
  filteredData = this.justifications;

  elements:number = 10 ;
  page:number = 1;
  last_page:number = 0;
  total_elements:number = 0;
  page_options:number[] = [];

  included:string[] = ['aprobation', 'assistance.session.course','assistance.apprentice.user'];
  filter?:{[key:string]:string|EstadoJustificacionEnum};
  ngOnInit(): void {
    this.loadInasistencias(); 
  }

  loadInasistencias(): void {
    const datasub = forkJoin([
      this.justificationService.getJustifications({
        included: this.included,
        page: this.page,
        elements: this.elements
      })
    ]).subscribe({
      next: ([justifications]) => {
        const { data, per_page, current_page, last_page, total } = justifications;
  
        // Actualizar el paginador
        this.setPage(current_page, per_page, last_page, total);
  
        // Asignar las justificaciones
        this.justifications = [...data];
      },
      error: (err) => {
        console.error('Error al cargar las justificaciones:', err);
      }
    });
  }
  
  setPage(current_page: number, per_page: number, last_page: number, total: number): void {
    this.page = current_page; // Página actual
    this.elements = per_page; // Elementos por página
    this.last_page = last_page; // Última página
    this.total_elements = total; // Total de elementos disponibles
  
    // Generar las opciones de páginas
    this.page_options = Array.from({ length: last_page }, (_, i) => i + 1);
  }
  

  getFilterJustificacion(filter?:{[key:string]:string|EstadoJustificacionEnum}){
    this.filter = filter;
    this.changePage(1);

    if(filter && filter['aprobationState'] != "Vencida"){
      this.isInasistencias = false;
    }
    else{
      this.isInasistencias = true;
    }
    console.log(filter);
    
  }
  changePage(page:number){
    console.log(page);
    this.justificationService
      .getJustifications({
        included:this.included,
        filter:this.filter,
        page:page,
        elements:this.elements
      })
      .subscribe({
        next: (justifications)=>{
          const {data,per_page,current_page,last_page,total: to} = justifications;
          this.setPage(current_page,per_page,last_page,to);
          this.justifications = [...data];
        }
      })
  }

  openModal(justification: JustificationModel): void {
    console.log('Justificación seleccionada:', justification);
    this.selectedJustification = justification;
    this.isModalVisible = true;
  }
  closeModal(): void {
    this.isModalVisible = false; 
  }


  handleSubmission(data: { file: File; reason: string }): void {
    console.log('Archivo cargado:', data.file);
    console.log('Motivo:', data.reason);
    this.isModalVisible = false; 
  }

setEstadoJustificacion(estado?:EstadoJustificacionEnum){
  this.estadoJustificacion = estado;
}

updateJustificationStatus(justification: JustificationModel): void {
  const newStatus: 'Aprobada' = 'Aprobada'; // Establece el estado como "Aprobada"
  
  this.justificationService
    .updateJustificationStatus(justification.id, newStatus) // Método en el servicio
    .subscribe({
      next: () => {
        if (justification.aprobation) {
          justification.aprobation.state = newStatus; // Actualiza el estado localmente
        } else {
          console.error('La propiedad "aprobation" es undefined');
        }
        this.isModalVisible = false;
      },
      error: (err) => {
        console.error('Error al actualizar la justificación:', err);
      }
    });
}


}


}