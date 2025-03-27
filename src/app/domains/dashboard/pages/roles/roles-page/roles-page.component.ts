import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiRolesService } from '@shared/services/api-roles.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { ChargeExcelService } from '@shared/services/charge-excel.service';

import { ChargeButtonComponent } from './charge-button/charge-button.component';
import { UserService } from '@shared/services/user.service';
import { UserModel } from '@shared/models/user.model';

@Component({
  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzDividerModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
    NzPaginationModule,
    NzUploadModule,
    NzTabsModule,
    ChargeButtonComponent,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css',
})
export class RolesComponent implements OnInit {
  //logica para abrir el boton de cargue masivo

  @ViewChild('chargeButton') chargeButton: any = ChargeButtonComponent;

  private chargeExcelService = inject(ChargeExcelService);

  
  isVisible = false;
  isVisibleCargue = true;
  isDropdownOpen = false;
  allUsers: UserModel[] = [];
  users: any[] = [];
  selectedUser: any;
  selectedRoles: any[] = [];
  isActive: boolean = true;
  roles: any = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  pageIndex: any;
  pageSize: any;
  totalItems: any;
  selectedFile: File | null = null;
  
  showModalCargue(): void {
    this.chargeButton.isVisibleCargue = true;
  }

  changePage(newPage: number) {
    this.pageIndex = newPage;
    this.getUsers(this.pageIndex, this.pageSize);
  }
  // Modifica tu función onRolesChange
onRolesChange(selectedRoles: any[]): void {
  this.selectedRoles = selectedRoles;
  console.log('Cerrando dropdown..  .', this.isDropdownOpen);
  
  // Cierra el dropdown después de seleccionar
  this.isDropdownOpen = false;
  
  // Aquí puedes mantener cualquier otra lógica que ya tengas
}

// Opcional: si quieres manejar la apertura/cierre manualmente
toggleDropdown(): void {
  this.isDropdownOpen = !this.isDropdownOpen;
}

// Opcional: si usas búsqueda en el select
onSearchChange(searchText: string): void {
  // Puedes agregar lógica de búsqueda aquí si es necesario
}

  tabs = [
    {
      title: 'Pestaña 1',
      description: 'Cargar archivo para la API 1',
      apiRoute: '/api/upload1',
    },
    {
      title: 'Pestaña 2',
      description: 'Cargar archivo para la API 2',
      apiRoute: '/api/upload2',
    },
    {
      title: 'Pestaña 3',
      description: 'Cargar archivo para la API 3',
      apiRoute: '/api/upload3',
    },
  ];


  onFileSelected(event: any, apiRoute: string) {
    this.selectedFile = event.target.files[0];
    console.log(`Archivo seleccionado para ${apiRoute}:`, this.selectedFile);
  }

  uploadFile(apiRoute: string) {
    if (this.selectedFile) {
      console.log(`Subiendo archivo a ${apiRoute}...`, this.selectedFile);
      // Aquí puedes agregar la lógica para subir el archivo a la API correspondiente
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  }

  closeModal() {
    console.log('Modal cerrado');
    // Aquí puedes agregar la lógica para cerrar el modal
  }

  private rolesService = inject(ApiRolesService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.getUsers();
    this.allRoles();
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
      
      },
    });
  }
  allRoles() {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      }
    });
  }

  //mostrar todos los usuarios con su respectivo rol,traidos desde el servicio
  getUsers(page: number = 1, pageSize: number = 8): void {
    this.rolesService.getUsers(page, pageSize).subscribe({
      next: (response) => {
        // Extrae los datos de la respuesta
        const { data, total, current_page, per_page } = response;

        // Mapea los usuarios y extrae los roles
        this.users = data.map((user: { training_centers?: any[] }) => ({
          ...user,
          roles:
            user.training_centers?.map((tc: { role_id: any }) => tc.role_id) ||
            [],
        }));
        console.log(this.users);

        // Asigna los usuarios filtrados
        this.filteredUsers = [...this.users];

        // Actualiza las propiedades de paginación
        this.totalItems = total;
        this.pageIndex = current_page;
        this.pageSize = per_page;
      },
      error: (error) => console.error('Error al obtener usuarios', error),
    });
  }

  resetSearch(){
    
  }
  // Filtrar usuarios por nombre, apellido o documento
  searchUsers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.allUsers.filter(
      (user) =>
        user.identity_document.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.last_name.toLowerCase().includes(term)
    );
    this.pageIndex = 1;
    // Si el término de búsqueda está vacío, muestra todos los usuarios o los originales
    if (!term) {
      this.filteredUsers = [...this.allUsers]; // o this.resetSearch() si tienes un método para eso
    }
  }

  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = [...user.roles];
    console.log(this.selectedRoles);
  }
  toggleUserStatus(user: any): void {
    if (!user || !user.id) {
      console.error('Usuario inválido');
      return;
    }

    // Determinar si se activará o desactivará el usuario
    const isActive = user.deactivation_date ? false : true;

    this.rolesService.toggleUserStatus(user.id, isActive).subscribe({
      next: (response) => {
        console.log(response.message);

        // Invertir el estado localmente
        user.deactivation_date = isActive ? null : new Date().toISOString();

        // Actualizar la lista de usuarios
        this.getUsers();
      },
      error: (error) => {
        console.error('Error al cambiar el estado del usuario', error);
      },
    });
  }
  handleOk(): void {
    this.isVisibleCargue = false;
    if (!this.selectedUser || !this.selectedUser.id) {
      console.error('Usuario inválido');
      return;
    }

    // Asegúrate de que los roles sean IDs numéricos
    const roleIds = this.selectedRoles.map((role) => Number(role));

    this.rolesService.assignRoles(this.selectedUser.id, roleIds).subscribe({
      next: () => {
        console.log('Roles asignados correctamente');
        this.selectedUser.roles = [...roleIds]; // Actualiza la UI
        this.isVisible = false;
      },
      error: (error) => console.error('Error al asignar roles', error),
    });
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleCargue = false;
  }
 

  getRoleName(roleId: number): string {
    return (
      this.roles?.find((rol: any) => rol.id === roleId)?.name || 'Desconocido'
    );
  }
  pageIndexChange(item: any) {
    this.pageIndex = item;
    console.log(this.pageIndex);
  }
}
