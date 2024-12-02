
import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PendingModalComponent } from './pending-modal/pending-modal.component';
import { JustificationModel } from '@shared/models/justificationModel';
import { SessionModel } from '@shared/models/session.model';
import { UpPDFPendingComponent } from "./up-pdfpending/up-pdfpending.component";


@Component({
  selector: 'app-justification-apprentice',
  standalone: true,
  
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTableModule,
    NzTabsModule,
    PendingModalComponent,
    UpPDFPendingComponent
],
  templateUrl: './justification-apprentice.component.html',
  styleUrl: './justification-apprentice.component.css',
  
})
export class JustificationApprenticeComponent {


  allData = [
   
    {
      session: '2024-11-17',
      instructor: 'María López',
      shift: '7:00 - 13:00',
      state: 'Pendientes',
    }
    ,  {
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
    {
      session: '2024-11-09',
      instructor: 'Luis Torres',
      shift: '7:00 - 13:00',
      state: 'Inasistencias',
    },
  ];

  filteredData = this.allData;
  isModalVisible = false;
  isFirstModalVisible: boolean = false; // Controla el primer modal
  isSecondModalVisible: boolean = false; // Controla el segundo modal


  openSecondModal(): void {
    this.isFirstModalVisible = false;
    this.isSecondModalVisible = true;
  }

  closeSecondModal(): void {
    this.isSecondModalVisible = false;
  }

 
 
 
 
  openModal(): void {
    
    this.isModalVisible = true; 
    
    
  }
  closeModal(data:boolean): void {
    this.isModalVisible = data; 
    
  }



  onTabChange(index: number): void {
    const tabs = ['Inasistencias', 'Pendientes', 'Rechazadas', 'Aprobadas', 'Vencidas'];
    const selectedTab = tabs[index];
  
    if (selectedTab === 'Inasistencias') {
      // Mostrar todas las justificaciones
      this.filteredData = this.allData;
    } else {
      // Filtrar por estado
      this.filteredData = this.allData.filter(data => data.state === selectedTab);
    }
  }
  
 

}
