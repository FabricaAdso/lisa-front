import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiRolesService } from '@shared/services/api-roles.service';
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
export class NzDemoModalBasicComponent implements OnInit {
  isVisible = false;
  users: any[] = []; // Lista de usuarios para la tabla
  selectedUser: any;
  selectedRoles: string[] = [];
  isActive: boolean = false;
  allRoles = ['Administrador', 'Aprendiz', 'Instructor', 'Coordinador Academico'];

  constructor(private userService: ApiRolesService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Cargar los usuarios desde el servicio
  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (error) => console.error('Error al obtener usuarios', error)
    });
  }

  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = [...user.roles];
    this.isActive = user.active;
  }

  handleOk(): void {
    // Actualizar roles
    this.userService.toggleUserRole(this.selectedUser.id, this.selectedRoles).subscribe({
      next: () => console.log('Roles actualizados correctamente'),
      error: (error) => console.error('Error al actualizar roles', error)
    });

    // Actualizar estado
    this.userService.toggleUserStatus(this.selectedUser.id, this.isActive).subscribe({
      next: () => console.log('Estado de usuario actualizado correctamente'),
      error: (error) => console.error('Error al actualizar estado de usuario', error)
    });

    this.isVisible = false;
    this.getUsers(); // Recargar usuarios para ver cambios en la tabla
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  toggleUserStatus(user: any): void {
    user.active = !user.active;
    this.userService.toggleUserStatus(user.id, user.active).subscribe({
      next: () => console.log('Estado de usuario actualizado'),
      error: (error) => console.error('Error al actualizar estado de usuario', error)
    });
  }
}