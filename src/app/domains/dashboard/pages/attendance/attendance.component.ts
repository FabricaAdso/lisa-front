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
import { RegisterAssistanceModel } from '@shared/models/register-assistance.model';
import { SessionService } from '@shared/services/program/session.service';
import { GeneralAssistanceData } from '@shared/models/generalDataAssistance-model';
import { SessionModel } from '@shared/models/session.model';


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
],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

  @ViewChild('attendanceTable') attendanceTable:any = AttendanceTableComponent;

  private course_service = inject(CourseService);
  private session_service = inject(SessionService);
  
  @Input() course_code?:number;
  @Input() session_id?:number;

  course: CourseModel[]=[];
  assistance: AssistanceModel[] = [];
  listOfData: any[] = [];
  listDAtos: any[][] = [];
  listOfData2: SessionModel | null = null;

  Math = Math;
  showDefaultTable = true;
  rowsPerTable = 5; 
  tablesPerPage = 3; 
  currentPage = 1; 

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
      this.session_service.getSessionShow(this.session_id!,{ included: ['assistances.apprentice.user', 'instructor.user', 'course.environment.headquarters'] }),
    ]).subscribe({
      next: ([assistance]) => {

        this.listOfData = assistance.assistances.map((item) => this.mapToAssistance(item));// Agrupa los datos para multiples tablas
        this.listOfData2 = assistance
        console.log(this.listOfData2);
        
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

