import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiRolesService } from '@shared/services/api-roles.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzOptionComponent, NzSelectModule} from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [FormsModule, CommonModule, NzButtonModule, NzModalModule,NzTableModule,NzDividerModule,NzOptionComponent,NzSelectModule,NzIconModule],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css'
})
export class RolesComponent implements OnInit {
  isVisible = false;
  users: any[] = [];
  selectedUser: any;
  selectedRoles: string[] = [];
  isActive: boolean = true;
  allRoles = ['Administrador', 'Aprendiz', 'Instructor', 'Coordinador Academico'];

  constructor(private userService: ApiRolesService) {}

  ngOnInit(): void {

    this.getUsers();

  }
 // Cargar roles y estado desde localStorage
 loadUserData(): void {
  this.users.forEach(user => {
    const storedRoles = localStorage.getItem(`user_roles_${user.id}`);
    const storedStatus = localStorage.getItem(`user_status_${user.id}`);

    if (storedRoles) {
      user.roles = JSON.parse(storedRoles);
    }
    if (storedStatus) {
      user.desactive = JSON.parse(storedStatus);
    }
  });
}
  // Cargar los usuarios desde el servicio
  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) =>{
        this.users = data
        this.loadUserData();
        console.log(data);

      },
      error: (error) => console.error('Error al obtener usuarios', error)
    });
  }

  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = [...user.roles]  ;
    this.isActive = !user.desactive;
  }

  handleOk(): void {


    // Actualizar roles
    this.userService.toggleUserRole(this.selectedUser.id, this.selectedRoles).subscribe({
      next: () => {
        console.log('Roles actualizados correctamente');
        localStorage.setItem(`user_roles_${this.selectedUser.id}`, JSON.stringify(this.selectedRoles)); // Guardar roles en localStorage
        this.selectedUser.roles = [...this.selectedRoles];
        this.getUsers();
      },
      error: (error) => console.error('Error al actualizar roles', error)
    });

    // Actualizar estado
    this.selectedUser.desactive = !this.isActive;
    this.userService.toggleUserStatus(this.selectedUser.id, this.isActive).subscribe({
      next: () => {
        console.log('Estado de usuario actualizado correctamente');
        localStorage.setItem(`user_status_${this.selectedUser.id}`, JSON.stringify(this.isActive)); // Guardar estado en localStorage
        this.getUsers();

      },
      error: (error) => console.error('Error al actualizar estado de usuario', error)
    });

    this.isVisible = false;

  }
  onStatusChange(): void {
    this.isActive = !this.isActive; 
    console.log('Estado de checkbox cambiado:', this.isActive);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  toggleUserStatus(user: any): void {
    user.desactive = !user.desactive;
    this.userService.toggleUserStatus(user.id, user.desactive).subscribe({
      next: () => {
        console.log('Estado de usuario actualizado');
        localStorage.setItem(`user_status_${user.id}`, JSON.stringify(user.desactive));
        if (this.selectedUser && this.selectedUser.id === user.id) {

          this.isActive = !user.desactive;
        }
      },
      error: (error) => console.error('Error al actualizar estado de usuario', error)
    });
  }

  onRolesChange(selected: string[]): void {
    this.selectedRoles = selected;
  }


}
