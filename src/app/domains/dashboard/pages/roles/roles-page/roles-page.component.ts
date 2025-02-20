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
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzDividerModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzUploadModule],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css'
})
export class RolesComponent implements OnInit {
  fileList: NzUploadFile[] = [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png'
    }
  ];
  isVisible = false;
  users: any[] = [];
  selectedUser: any;
  selectedRoles: any[] = [];
  isActive: boolean = true;
  allRoles = ['Usuario', 'Coordinador academico', 'Instructor', 'Aprendiz','Administrador'];

  constructor(private userService: ApiRolesService) {}

  ngOnInit(): void {
    this.getUsers();
  }

//mostrar todos los usuarios con su respectivo rol,traidos desde el servicio
  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data.map((user: { training_centers: any[]; }) => ({
          ...user,
          roles: user.training_centers.map((tc: { role_id: any; }) => tc.role_id) // Extrae solo los roles
        }));
        console.log(this.users);
      },
      error: (error) => console.error('Error al obtener usuarios', error)
    });
  }

  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = [...user.roles]  ;
  }
  toggleUserStatus(user: any): void {
    if (!user || !user.id) {
      console.error('Usuario inválido');
      return;
    }

    // Determinar si se activará o desactivará el usuario
    const isActive = user.deactivation_date ? false : true;

    this.userService.toggleUserStatus(user.id, isActive).subscribe({
      next: (response) => {
        console.log(response.message);

        // Invertir el estado localmente
        user.deactivation_date = isActive ? null : new Date().toISOString();

        // Actualizar la lista de usuarios
        this.getUsers();
      },
      error: (error) => {
        console.error('Error al cambiar el estado del usuario', error);
      }
    });
  }
  handleOk(): void {
    if (!this.selectedUser || !this.selectedUser.id) {
      console.error('Usuario inválido');
      return;
    }

     // Asegúrate de que los roles sean IDs numéricos
  const roleIds = this.selectedRoles.map(role => Number(role));

  this.userService.assignRoles(this.selectedUser.id, roleIds).subscribe({
    next: () => {
      console.log('Roles asignados correctamente');
      this.selectedUser.roles = [...roleIds]; // Actualiza la UI
      this.isVisible = false;
    },
    error: (error) => console.error('Error al asignar roles', error)
  });
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  onRolesChange(selected: string[]): void {
    this.selectedRoles = selected; // Sincronizar los roles seleccionados
  }



}
