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
  asociar(){
    for  (let i = 0; i < this.allRoles.length; i++) {
      console.log(this.allRoles[i], i)
    }

    this.allRoles[0] 
    

  }
  // Cargar los usuarios desde el servicio
  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) =>{
        this.users = data
        console.log(data);
        
      }, 
      error: (error) => console.error('Error al obtener usuarios', error)
    });
  }

  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = {...user.roles};
    this.isActive = user.desactive;
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
    user.desactive = !user.desactive;
    this.userService.toggleUserStatus(user.id, user.desactive).subscribe({
      next: () => console.log('Estado de usuario actualizado'),
      error: (error) => console.error('Error al actualizar estado de usuario', error)
    });
  }


}
