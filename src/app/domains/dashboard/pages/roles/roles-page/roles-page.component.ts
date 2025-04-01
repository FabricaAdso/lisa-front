import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiRolesService } from '@shared/services/api-roles.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ChargeButtonComponent } from './charge-button/charge-button.component';
import { UserService } from '@shared/services/user.service';
import { UserModel } from '@shared/models/user.model';
import { RoleModel } from '@shared/models/rolemodel-model';
import { EditRolesModalComponent } from './edit-roles-modal/edit-roles-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'nz-demo-modal-basic',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
    NzPaginationModule,
    NzUploadModule,
    NzTabsModule,
    ChargeButtonComponent,
    EditRolesModalComponent,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css',
})
export class RolesComponent implements OnInit {
  //logica para abrir el boton de cargue masivo
  @ViewChild('chargeButton') chargeButton: any = ChargeButtonComponent;
  @ViewChild('modalRoles') modalRoles: any = EditRolesModalComponent;

  //injeccion de servicios
  private rolesService = inject(ApiRolesService);
  private userService = inject(UserService);
  private notification = inject(NzNotificationService);

  //Declaracion de variables
  isVisibleCargue = true;
  isDropdownOpen = false;
  allUsers: UserModel[] = [];
  users: UserModel[] = [];
  selectedUser: number | null = null;
  selectedRoles: RoleModel[] = [];
  isActive: boolean = true;
  roles: RoleModel[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  pageIndex: any;
  pageSize: any;
  totalItems: any;
  selectedFile: File | null = null;
  isVisible = false;
  isSearching: boolean = false;
  allUsersLoaded: boolean = false;
  loading: boolean = false;


  showModalCargue(): void {
    this.chargeButton.isVisibleCargue = true;
  }

  openModalRoles(user: UserModel): void {
    if (!user?.id) {
      this.notification.error('Error', 'Usuario inválido');
      return;
    }

    this.selectedUser = user.id;

    // Pasar el usuario completo al modal
    this.modalRoles.setData(user);
    this.modalRoles.openModal();
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

  ngOnInit(): void {
    this.getUsers();
    this.allRoles();
    this.getAllUsers();
  }
  allRoles() {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;

      },
    });
  }

// Modifica tu método getUsers así:
getUsers(page: number = 1, pageSize: number = 8): void {
  this.loading = true;

  this.rolesService.getUsers(page, pageSize).subscribe({
    next: (response) => {
      const { data, total, current_page, per_page } = response;

      // Como los roles ya vienen en la respuesta, simplemente asignamos los usuarios
      this.users = data;

      // Solo actualizamos filteredUsers si no estamos en modo búsqueda
      if (!this.isSearching) {
        this.filteredUsers = [...this.users];
      }

      this.totalItems = total;
      this.pageIndex = current_page;
      this.pageSize = per_page;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al obtener usuarios', error);
      this.loading = false;
    }
  });
}


// Modifica tu método loadAllUsersForSearch así:
loadAllUsersForSearch(): void {
  this.loading = true;
  this.isSearching = true;

  this.rolesService.getUsersByTrainingCenterSearch().subscribe({ // Asumo que tienes un endpoint para todos los usuarios
    next: (users) => {
      this.allUsers = users.map((user: any) => ({
        ...user,
        roles: user.training_centers?.map((tc: any) => tc.role_id) || [],
      }));
      this.filterUsers();
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar todos los usuarios', error);
      this.loading = false;
    }
  });
}


// Agrega este método para manejar el clic fuera del buscador
onSearchBlur(): void {
  if (!this.searchTerm.trim()) {
    this.resetToPagination();
  }
}

// Reemplaza tu método searchUsers por este:
searchUsers(): void {
  const term = this.searchTerm.trim().toLowerCase();

  if (!term) {
    this.resetToPagination();
    return;

    
  }

  this.loading = true;
  this.isSearching = true;

  this.rolesService.getUsersByTrainingCenterSearch(term).subscribe({
    next: (users) => {
      this.filteredUsers = users.map((user: any) => ({
        ...user,
        // Los roles ya vienen del backend en el formato correcto
        roles: user.roles || []
      }));
      this.totalItems = this.filteredUsers.length;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al buscar usuarios', error);
      this.loading = false;
    }
  });
}
// Nuevo método para resetear a la paginación normal
resetToPagination(): void {
  this.isSearching = false;
  this.filteredUsers = [...this.users];
  this.pageIndex = 1;
  this.getUsers(this.pageIndex, this.pageSize);
}
// Método para filtrar usuarios
filterUsers(): void {
  const term = this.searchTerm.toLowerCase().trim();
  this.filteredUsers = this.allUsers.filter(user =>
    user.identity_document.toLowerCase().includes(term) ||
    user.name.toLowerCase().includes(term) ||
    user.last_name.toLowerCase().includes(term)
  );
  this.pageIndex = 1;
  this.totalItems = this.filteredUsers.length;
}


// Cambio de página
changePage(newPage: number) {
  this.pageIndex = newPage;
  this.getUsers(this.pageIndex, this.pageSize, );
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

  getRoleName(roleId: number): string {
    return (
      this.roles?.find((rol: any) => rol.id === roleId)?.name || 'Desconocido'
    );
  }
}



