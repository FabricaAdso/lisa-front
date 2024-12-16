import { Component, inject, Input } from '@angular/core';
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
    ReactiveFormsModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {
  private assistance_service = inject(AssistanceService);
  private apprentice_service = inject(ApprenticeService);
  
  @Input() course_code?:number;

  assistance: AssistanceModel[] = [];
  listOfData: any[] = [];
  listDAtos: any[][] = []; // Almacena los grupos de datos para multiples tablas

  Math = Math; // Exponer Math para usarlo en la plantilla
  showDefaultTable = true; // Estado para alternar entre la tabla por defecto y la nueva tabla
  rowsPerTable = 5; // Cantidad de filas por tabla
  tablesPerPage = 3; // Cantidad de tablas por página
  currentPage = 1; // Pagina actual

  isVisible = false;

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
        
        
        this.evaluarCantidadTablas(); // Agrupa los datos para multiples tablas
      },
    });
  }

  toggleAssistance(assistanceId: number, event: Event) {
    const isChecked = (event!.target as HTMLInputElement).checked;

    const data: UpdateAssistanceDTO = {
      id: assistanceId,
      assistance: isChecked,
    };

    this.assistance_service.saveAssistances(data).subscribe({
      next: (updated) => {
        console.log('Asistencia actualizada:', updated);
      },
      error: (err) => {
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

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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

