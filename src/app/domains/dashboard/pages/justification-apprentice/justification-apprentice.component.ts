
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';


@Component({
  selector: 'app-justification-apprentice',
  standalone: true,
  
  imports: [
    CommonModule, NzTableModule, NzButtonModule, NzTableModule, NzTabsModule
 
  
  ],
  templateUrl: './justification-apprentice.component.html',
  styleUrl: './justification-apprentice.component.css'
})
export class JustificationApprenticeComponent {


  allData = [
    {
      session: '2024-11-18',
      instructor: 'Juan Pérez',
      shift: '7:00 - 13:00',
      state: 'Inasistencias',
    },
    {
      session: '2024-11-17',
      instructor: 'María López',
      shift: '7:00 - 13:00',
      state: 'Pendientes',
    }
  ];


  filteredData = this.allData; // Datos filtrados según la pestaña seleccionada

  onTabChange(index: number): void {
    const tabs = ['Inasistencias', 'Pendientes', 'Rechazadas', 'Aprobadas', 'Vencidas'];
    const selectedTab = tabs[index];
    this.filteredData = this.allData.filter(data => data.state === selectedTab);
  }

  openModal(data: any): void {
    console.log('Abrir modal para:', data);
    // Aquí abrirás el modal correspondiente
  }

}
