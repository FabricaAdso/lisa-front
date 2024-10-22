import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
@Component({
  // selector: 'app-roles-page',
  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [FormsModule, CommonModule, NzButtonModule, NzModalModule],
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
 
   // Abrir modal y cargar datos del usuario seleccionado
   openEditRolesModal(user: any): void {
     this.isModalOpen = true;
     this.selectedUser = user;
     this.selectedRoles = [...user.roles]; // Copia los roles actuales del usuario
     this.isActive = user.active; // Copia el estado actual del usuario
   }
 
   // Cerrar modal
   closeModal(): void {
     this.isModalOpen = false;
   }
 
   // Guardar los cambios de roles y estado del usuario
   saveChanges(): void {
     this.selectedUser.roles = this.selectedRoles; // Actualiza los roles del usuario
     this.selectedUser.active = this.isActive; // Actualiza el estado activo/inactivo del usuario
     this.isModalOpen = false; // Cierra el modal
   }
 
   // Alternar el estado de activación del usuario directamente desde la tabla
   toggleUserStatus(user: any): void {
     user.active = !user.active;
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
