import { Component } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    NzButtonModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {
  listOfData: Person[] = [
    {
      key: '1',
      nombre: 'John',
      apellido:'stiwar',
      documento: 254481,
      telefono:32154894,
      correo:'stiwar@gmail.com'
    },
    {
      key: '2',
      nombre: 'John',
      apellido:'stiwar',
      documento: 254481,
      telefono:32154894,
      correo:'stiwar@gmail.com'
    },
    {
      key: '3',
      nombre: 'John',
      apellido:'stiwar',
      documento: 254481,
      telefono:32154894,
      correo:'stiwar@gmail.com'
    }
  ];

}
