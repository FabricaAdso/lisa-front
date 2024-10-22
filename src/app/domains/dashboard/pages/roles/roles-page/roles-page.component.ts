import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
@Component({
  // selector: 'app-roles-page',

  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [FormsModule, CommonModule, NzButtonModule, NzModalModule,NzTableModule,NzDividerModule ],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css'
})
export class NzDemoModalBasicComponent {
  users = [
    { id: 1, documento: '123456', nombre: 'Juan', apellido: 'Perez', active: true, roles: ['Instructor'] },
    { id: 2, documento: '789101', nombre: 'Maria', apellido: 'Gomez', active: false, roles: ['Aprendiz'] }
  ];
  isVisible = false;
  constructor() {}
   // Variables para el modal
   isModalOpen = false;
   selectedUser: any;
   selectedRoles: string[] = [];
   isActive: boolean = false;
   allRoles = ['Administrador', 'Aprendiz', 'Instructor','Coordinador Academico']; // Roles disponibles

   // Alternar el estado de activación del usuario directamente desde la tabla
   toggleUserStatus(user: any): void {
     user.active = !user.active;
   }
  showModal(user:any): void {
    this.isVisible = true;
    this.selectedUser = user;
     this.selectedRoles = [...user.roles]; // Copia los roles actuales del usuario
     this.isActive = user.active; // Copia el estado actual del usuario

  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.selectedUser.roles = this.selectedRoles; // Actualiza los roles del usuario
     this.selectedUser.active = this.isActive; // Actualiza el estado activo/inactivo del usuario
     this.isModalOpen = false; // Cierra el modal
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
}
