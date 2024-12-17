import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { AttendanceComponent } from '../attendance.component';
import { AssistanceModel } from '@shared/models/assistance.model';
import { AssistanceService } from '@shared/services/assistance.service';
import { forkJoin } from 'rxjs';
import { UpdateAssistanceDTO } from '@shared/dto/update-assistance.dto';
import { CommonModule } from '@angular/common';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterAssistanceModel } from '@shared/models/register-assistance.model';
import { CourseService } from '@shared/services/program/course.service';
import { SessionModel } from '@shared/models/session.model';

@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [CommonModule,NzTableComponent,ReactiveFormsModule],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.css'
})
export class AttendanceTableComponent implements OnInit,OnDestroy {

  private assistance_service = inject(AssistanceService);
  private course_service = inject(CourseService)
  listOfData: RegisterAssistanceModel[] = [];
  
  listDAtos: any[][] = []; // Almacena los grupos de datos para multiples tablas

  Math = Math; // Exponer Math para usarlo en la plantilla
  showDefaultTable = true; // Estado para alternar entre la tabla por defecto y la nueva tabla
  rowsPerTable = 4; // Cantidad de filas por tabla
  tablesPerPage = 3; // Cantidad de tablas por página
  currentPage = 1; // Pagina actual

  isVisible = false;
  

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
      this.course_service.getCursesInstructorNow({ included: ['assistances.apprentice.user'] }),
    ]).subscribe({
      next: ([assistance]) => {

        this.listOfData = assistance.assistances.map((item) => this.mapToAssistance(item));
        this.evaluarCantidadTablas(); // Agrupa los datos para multiples tablas
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

  toggleAssistance(assistanceId: number, event: Event) {
    const isChecked = (event!.target as HTMLInputElement).checked;

    const data: UpdateAssistanceDTO = {
      id: assistanceId,
      assistance: isChecked,
    };

    this.assistance_service.saveAssistances(data).subscribe({
      next: (updated:any) => {
        console.log('Asistencia actualizada:', updated);
        let indexasistencia = this.listOfData.findIndex(asistencia => asistencia.key == updated.assistance.id.toString());
        if (indexasistencia != -1) {
          this.listOfData[indexasistencia].assistance = updated.assistance.assistance

          this.listDAtos = [...this.listDAtos]

          this.evaluarCantidadTablas();
        }
        
  
      },
      error: (err:any) => {
        console.error('Error al actualizar asistencia:', err);
      },
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
