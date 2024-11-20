import { Component } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgIf } from '@angular/common';

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
    NgIf
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

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
    for (let index = 0; index < 50; index++) {
      this.listOfData.push(this.person);
    }
  }
  evaluarCantidadTablas(){
    for (let i = 0; i < this.listOfData.length; i += 6) {
      this.listDAtos.push(this.listOfData.slice(i, i + 6));
    }
  }
}
