import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ApiRolesService } from '../../../../../services-roles/api-roles.service';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [FormsModule, CommonModule, NzButtonModule, NzModalModule,NzTableModule,NzDividerModule,NzOptionComponent],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css'
})
export class RolesComponent implements OnInit {
  users: any[] = []; // Aquí se cargarán los usuarios desde el backend
  isVisible = false;
  selectedUser: any;
  selectedRoles: string[] = [];
  isActive: boolean = false;
  allRoles = ['Administrador', 'Aprendiz', 'Instructor', 'Coordinador Academico']; // Roles disponibles

  constructor(private userService: ApiRolesService) {}

  ngOnInit(): void {
    if (this.userService.isAuthenticated()) {
      this.loadUsers(); // Cargar usuarios si ya está autenticado
    }
  }

  login(): void {
    const credentials = { email: 'tu_email', password: 'tu_contraseña' }; // Obtén estos datos de tu formulario
    this.userService.login(credentials).subscribe(
      (response) => {
        this.userService.handleLogin(response); // Guarda el token
        this.loadUsers(); // Carga los usuarios después de iniciar sesión
      },
      (error) => {
        console.error('Error al iniciar sesión', error);
      }
    );
  }

  loadUsers(): void {
    if (this.userService.isAuthenticated()) {
      this.userService.getUsers().subscribe(
        (data) => {
          this.users = data;
        },
        (error) => {
          if (error.status === 401) {
            console.error('Usuario no autenticado o token expirado.');
            // Redirigir a la página de inicio de sesión si el token es inválido
          } else {
            console.error('Error al cargar usuarios:', error);
          }
        }
      );
    } else {
      console.error('Usuario no autenticado. Redirigir al inicio de sesión.');
      // Redirige al inicio de sesión si no está autenticado
    }
  }

  // Alternar el estado de activación del usuario directamente desde la tabla
  toggleUserStatus(user: any): void {
    user.active = !user.active;
  }

  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = [...user.roles]; // Copia los roles actuales del usuario
    this.isActive = user.active; // Copia el estado actual del usuario
  }

  handleOk(): void {
    this.userService.updateUserRoles(this.selectedUser.id, this.selectedRoles, this.isActive).subscribe(
      (response) => {
        console.log('Roles actualizados:', response);
        this.selectedUser.roles = this.selectedRoles; // Actualiza los roles del usuario
        this.selectedUser.active = this.isActive; // Actualiza el estado activo/inactivo del usuario
        this.isVisible = false; // Cierra el modal
      },
      (error) => {
        console.error('Error al actualizar roles', error);
      }
    );
  }

  handleCancel(): void {
    this.selectedRoles = [...this.selectedUser.roles]; // Restablecer roles
    this.isActive = this.selectedUser.active; // Restablecer estado activo
    this.isVisible = false;
  }
}
