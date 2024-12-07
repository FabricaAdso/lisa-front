
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PendingModalComponent } from './pending-modal/pending-modal.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { JustificationModel } from '@shared/models/justificationModel';
import { RejectedModalComponent } from './rejected-modal/rejected-modal.component';
import { ApprovedModalComponent } from './approved-modal/approved-modal.component';
import { ExpiredModalComponent } from './expired-modal/expired-modal.component';
import { AssistanceService } from '@shared/services/assistance.service';
import { AssistanceModel } from '@shared/models/assistance.model';


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


  private assistance = inject(AssistanceService); 
 
  assistances:AssistanceModel[] = [];


  allData = [

    {
      session: '2024-11-17',
      instructor: 'María López',
      shift: '7:00 - 13:00',
      state: 'Pendientes',
    }
    , {
      session: '2024-11-17',
      instructor: 'María López',
      shift: '7:00 - 13:00',
      state: 'Pendientes',
    },
    {
      session: '2024-11-16',
      instructor: 'Carlos Gómez',
      shift: '8:00 - 12:00',
      state: 'Rechazadas',
    },
    {
      session: '2024-11-15',
      instructor: 'Ana García',
      shift: '9:00 - 14:00',
      state: 'Aprobadas',
    },
    {
      session: '2024-11-14',
      instructor: 'Luis Torres',
      shift: '10:00 - 16:00',
      state: 'Vencidas',
    },
    {
      session: '2024-11-13',
      instructor: 'Juan Pérez',
      shift: '7:00 - 13:00',
      state: 'Pendientes',
    },
    {
      session: '2024-11-12',
      instructor: 'María López',
      shift: '8:00 - 12:00',
      state: 'Rechazadas',
    },
    {
      session: '2024-11-11',
      instructor: 'Carlos Gómez',
      shift: '9:00 - 14:00',
      state: 'Aprobadas',
    },
    {
      session: '2024-11-10',
      instructor: 'Ana García',
      shift: '10:00 - 16:00',
      state: 'Vencidas',
    },
  
  ];



  // Control de modal dinámico
  isModalVisible = false;
  selectedJustification!: JustificationModel; // Justificación seleccionada

  filteredData = this.allData;


  openModal(data:any): void {

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
   onTabChange(index: number): void {
    const tabs = ['Inasistencias', 'Pendientes', 'Rechazadas', 'Aprobadas', 'Vencidas'];
    const selectedTab = tabs[index];
    this.filteredData =
      selectedTab === 'Inasistencias' ? this.allData : this.allData.filter(item => item.state === selectedTab);
  }

 


}
