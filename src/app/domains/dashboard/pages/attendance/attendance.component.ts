import { Component, Input } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgFor, NgIf } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';


interface Person {
  key: string;
  nombre: string;
  apellido:string;
  documento:number;
  telefono:number;
  correo: string;
}
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
    NgFor,
    NzModalModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

  @Input() course_code?:number;

  person = {
    key: '1',
    nombre: 'John',
    apellido:'stiwar',
    documento: 254481,
    telefono:32154894,
    correo:'stiwar@gmail.com'
  }
  listDAtos:any[] =[]
  listOfData: Person[] = [];
  showDefaultTable = true; // Estado para alternar entre la tabla por defecto y la nueva tabla

  toggleTable() {
    this.showDefaultTable = !this.showDefaultTable; // Cambia el estado
  }
  ngOnInit(): void {
    // alert(this.course_code);
    for (let index = 0; index < 20
      
      ; index++) {
      this.listOfData.push(this.person);
    }
  }
  evaluarCantidadTablas(){
    for (let i = 0; i < this.listOfData.length; i += 6) {
      this.listDAtos.push(this.listOfData.slice(i, i + 6));
    }
  }
  isVisible = false;

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
