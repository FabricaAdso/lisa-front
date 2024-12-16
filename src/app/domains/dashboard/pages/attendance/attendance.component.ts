import { Component, HostListener, inject, ViewChild, Input } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { AssistanceModel } from '@shared/models/assistance.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AttendanceTableComponent } from "./attendance-table/attendance-table.component";
import { NzTabSetComponent, NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { CourseService } from '@shared/services/program/course.service';
import { CourseModel } from '@shared/models/course.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SessionShowComponent } from "./session-show/session-show.component";

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    NzDescriptionsModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
    NgIf,
    NzModalModule,
    CommonModule,
    ReactiveFormsModule,
    AttendanceTableComponent,
    NzTabsModule,
    NzPageHeaderModule,
    NzStatisticModule,
    SessionShowComponent
],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

  @ViewChild('attendanceTable') attendanceTable:any = AttendanceTableComponent;
  @ViewChild('sessionShowModal') sessionShowModal:any = SessionShowComponent;

  private courses_service = inject(CourseService);
  
  @Input() course_code?:number;
  @Input() session_code?:number;

  course: CourseModel[]=[];
  assistance: AssistanceModel[] = [];
  listOfData: any[] = [];
  listDAtos: any[][] = []; // Almacena los grupos de datos para multiples tablas

  Math = Math; // Exponer Math para usarlo en la plantilla
  showDefaultTable = true; // Estado para alternar entre la tabla por defecto y la nueva tabla
  rowsPerTable = 5; // Cantidad de filas por tabla
  tablesPerPage = 3; // Cantidad de tablas por página
  currentPage = 1; // Pagina actual

  isVisible = false;

  openModalSession(){
    if(this.sessionShowModal){
      this.sessionShowModal.openModal();
      console.log('modal abierto');
    }
  }

  // Método para llamar la función prevPage() del hijo
  callPrevPage() {
    if (this.attendanceTable) {
      this.attendanceTable.prevPage();
    }
  }

  trackByKey(index: number, item: any): any {
    return item.key || index; // Usa 'key' si está disponible, de lo contrario el índice
  }
  

  // Método para llamar la función nextPage() del hijo
  callNextPage() {
    if (this.attendanceTable) {
      this.attendanceTable.nextPage();
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  toggleTable() {
    this.showDefaultTable = !this.showDefaultTable; // Cambia el estado
  }

 
  getData() {
    const data_sub = forkJoin([
      this.courses_service.getCourses({ included: ['apprentices.user'] }),
    ]).subscribe({
      next: ([course]) => {
        this.course = [...course];
      // Mapeamos cada course que es un array
      const dataCourse = this.course.flatMap((item) => {
        // Verificamos si apprentices es un array
        if (Array.isArray(item.apprentices)) {
          return item.apprentices?.map((apprentice) => ({
            key: item.id.toString(),
            nombre: apprentice.user?.first_name || 'No disponible',
            apellido: apprentice.user?.last_name || 'No disponible',
            documento: apprentice.user?.identity_document || 'No disponible',
            correo: apprentice.user?.email || 'No disponible'
          })) || [];
        }else{
          return [];  
        } 
      });

      // Asignamos los datos a la lista
      this.listOfData = [...dataCourse];
    },
    complete(){
      data_sub.unsubscribe()
    }
    });
  }



  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}

