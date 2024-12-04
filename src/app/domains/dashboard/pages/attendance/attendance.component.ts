import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AssistanceService } from '@shared/services/assistance.service';
import { forkJoin } from 'rxjs';
import { AssistanceModel } from '@shared/models/assistance.model';
import { ApprenticeService } from '@shared/services/apprentice.service';
import { ApprenticeModel } from '@shared/models/apprentice.model';
import { UpdateAssistanceDTO } from '@shared/dto/update-assistance.dto';
import { UserModel } from '@shared/models/user.model';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AttendanceTableComponent } from "./attendance-table/attendance-table.component";
import { NzTabSetComponent, NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

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
    NzStatisticModule
],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

  @ViewChild('attendanceTable') attendanceTable:any = AttendanceTableComponent;

  private assistance_service = inject(AssistanceService);

  assistance: AssistanceModel[] = [];
  listOfData: any[] = [];
  listDAtos: any[][] = []; // Almacena los grupos de datos para multiples tablas

  Math = Math; // Exponer Math para usarlo en la plantilla
  showDefaultTable = true; // Estado para alternar entre la tabla por defecto y la nueva tabla
  rowsPerTable = 5; // Cantidad de filas por tabla
  tablesPerPage = 3; // Cantidad de tablas por página
  currentPage = 1; // Pagina actual

  isVisible = false;


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
      this.assistance_service.getAssitanceAll({ included: ['apprentice.user'] }),
    ]).subscribe({
      next: ([assistance]) => {
        this.assistance = [...assistance];
        const dataAssistance = this.assistance.map((item) => ({
          key: item.id.toString(),
          assistance: item.assistance,
          nombre: item.apprentice?.user?.first_name,
          apellido: item.apprentice?.user?.last_name,
          documento: item.apprentice?.user?.identity_document,
          correo: item.apprentice?.user?.email,
        }));

        this.listOfData = [...dataAssistance]

      },
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

