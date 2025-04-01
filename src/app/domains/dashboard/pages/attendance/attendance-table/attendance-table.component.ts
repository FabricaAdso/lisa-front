import { Component, HostListener, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AssistanceModel } from '@shared/models/assistance.model';
import { AssistanceService } from '@shared/services/assistance.service';
import { forkJoin } from 'rxjs';
import { UpdateAssistanceDTO } from '@shared/dto/update-assistance.dto';
import { CommonModule } from '@angular/common';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterAssistanceModel } from '@shared/models/register-assistance.model';
import { SessionService } from '@shared/services/program/session.service';
import { AttendanceComponent } from '../attendance.component';

@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [CommonModule,NzTableComponent,ReactiveFormsModule,NzTableModule],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.css'
})
export class AttendanceTableComponent implements OnInit,OnDestroy {

  @Input() session_id:number | null = null; 

  private assistance_service = inject(AssistanceService);
  private session_service = inject(SessionService)

  listOfData: RegisterAssistanceModel[] = [];
  
  listDAtos: any[][] = []; // Almacena los grupos de datos para multiples tablas

  Math = Math; // Exponer Math para usarlo en la plantilla
  showDefaultTable = true; // Estado para alternar entre la tabla por defecto y la nueva tabla
  rowsPerTable = 6; // Cantidad de filas por tabla
  tablesPerPage = 3; // Cantidad de tablas por página
  currentPage = 1; // Pagina actual

  isVisible = false;

  timeoutId:any;
  

  ngOnInit(): void {
    this.getData();   
    this.adjustTablesPerPage(window.innerWidth);
  }

  ngOnDestroy(): void {
    this.getData();
  }
  

  toggleTable() {
    this.showDefaultTable = !this.showDefaultTable; // Cambia el estado
  }

  @HostListener('window:resize', ['$event']) // Detecta cambios en el tamaño de la ventana
  onResize(event: any): void {
    this.adjustTablesPerPage(event.target.innerWidth);
  }

  adjustTablesPerPage(width: number): void {
    if (width >= 1536) {
      this.tablesPerPage = 3; // Pantallas grandes
    } else if (width >= 912) {
      this.tablesPerPage = 2; // Pantallas medianas
    } else {
      this.tablesPerPage = 1; // Pantallas pequeñas
    }
    this.evaluarCantidadTablas();
  }

  getData() {
    const data_sub = forkJoin([
      this.session_service.getSessionShow(this.session_id!,{ included: ['assistances.apprentice.user', 'instructor.user', 'course.environment.headquarters'] }),
    ]).subscribe({
      next: ([assistance]) => {

        this.listOfData = assistance.assistances.map((item) => this.mapToAssistance(item));// Agrupa los datos para multiples tablas
        this.evaluarCantidadTablas()
      },
      complete(){
        data_sub.unsubscribe()
      }
    });
  }

  mapToAssistance(item:AssistanceModel):RegisterAssistanceModel{
    return{
      key: item.id.toString(),
      assistance: item.assistance,
      nombre: item.apprentice?.user?.name,
      apellido: item.apprentice?.user?.last_name,
      documento: item.apprentice?.user?.identity_document,
      correo: item.apprentice?.user?.email,
    }
  }

  // toggleAssistance(assistanceId: number, event: Event) {
  //   const isChecked = (event!.target as HTMLInputElement).checked;

  //   const data: UpdateAssistanceDTO = {
  //     id: assistanceId,
  //     assistance: isChecked,
  //   };

  //   this.assistance_service.saveAssistances(data).subscribe({
  //     next: (updated:any) => {
  //       let indexasistencia = this.listOfData.findIndex(asistencia => asistencia.key == updated.assistance.id.toString());
  //       if (indexasistencia != -1) {
  //         this.listOfData[indexasistencia].assistance = updated.assistance.assistance

  //         this.listDAtos = [...this.listDAtos]

  //         this.evaluarCantidadTablas();
  //       }
        
  
  //     },
  //     error: (err:any) => {
  //       console.error('Error al actualizar asistencia:', err);
  //     },
  //   });
  // }

  toggleAssistance(assistanceId: number, event: Event) {
    // Cancelar cualquier temporizador previo
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  
    // Alternar la asistencia sin afectar las demás
  this.listOfData = this.listOfData.map(item => {
    if (item.key === assistanceId.toString()) {
      // Invertir el estado de asistencia del seleccionado
      return { ...item, assistance: !item.assistance };
    }
    return item; // Mantener los demás sin cambios
  });
  
    // Actualizar la tabla
    this.listDAtos = [...this.listDAtos];
    this.evaluarCantidadTablas();
  
    // Reiniciar el contador de 5 segundos
    this.timeoutId = setTimeout(() => {
      this.sendAssistanceUpdate(); // Enviar actualización al backend después de 5 segundos
    }, 5000);
  }
  
  sendAssistanceUpdate() {
    // Crear el array de asistencias a actualizar
    const data: UpdateAssistanceDTO []= this.listOfData.map(item => ({
      id: parseInt(item.key!),
      assistance: item.assistance || false, // Asegurarse de que no sea null
    }));
  
    // Enviar las asistencias al backend
    this.assistance_service.saveAssistances(data).subscribe({
      next: (updated: any) => {
        console.log('Asistencias actualizadas', updated);
      }
    });
  }
  evaluarCantidadTablas() {
    this.listDAtos = [];
    for (let i = 0; i < this.listOfData.length; i += this.rowsPerTable) {
      this.listDAtos.push(this.listOfData.slice(i, i + this.rowsPerTable));
    }
  }

  get paginatedTables(): any[][] {
    const start = (this.currentPage - 1) * this.tablesPerPage;
    return this.listDAtos.slice(start, start + this.tablesPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.listDAtos.length / this.tablesPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
