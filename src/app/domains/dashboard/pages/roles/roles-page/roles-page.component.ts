import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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
export class RolesComponent implements OnInit, OnDestroy {
  //logica para abrir el boton de cargue masivo
  @ViewChild('chargeButton') chargeButton: any = ChargeButtonComponent;
  @ViewChild('modalRoles') modalRoles: any = EditRolesModalComponent;

  //injeccion de servicios
  private rolesService = inject(ApiRolesService);
  private userService = inject(UserService);
  private notification = inject(NzNotificationService);

  // Declaración para el debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  //Declaracion de variables
  isVisibleCargue = true;
  isDropdownOpen = false;
  allUsers: UserModel[] = [];
  users: UserModel[] = [];
  selectedUser: number | null = null;
  selectedRoles: RoleModel[] = [];
  isActive: boolean = true;
  roles: RoleModel[] = [];
  filteredUsers:UserModel[] = [];
  searchTerm: string = '';
  pageIndex: number = 1;
  pageSize: number = 8;
  totalItems: number = 0;
  selectedFile: File | null = null;
  isVisible = false;
  isSearching: boolean = false;
  allUsersLoaded: boolean = false;
  loading: boolean = false;

  ngOnInit(): void {
    this.getUsers();
    this.allRoles();
    this.getAllUsers();

    // Configuración del debounce para búsquedas
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de la última tecla
      distinctUntilChanged(), // Solo emite si el valor cambió
      takeUntil(this.destroy$) // Para desuscribirse automáticamente
    ).subscribe(searchTerm => {
      this.executeSearch(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  showModalCargue(): void {
    this.chargeButton.isVisibleCargue = true;
  }

  openModalRoles(user: UserModel): void {
    if (!user?.id) {
      this.notification.error('Error', 'Usuario inválido');
      return;
    }

    this.selectedUser = user.id;
    this.modalRoles.setData(user);
    this.modalRoles.openModal();
  }

  // ... (otros métodos como tabs, onFileSelected, uploadFile permanecen iguales) ...

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
  getUsers(page: number = 1, pageSize: number = 8): void {
    this.loading = true;

    // Si estamos buscando, no usar paginación del backend
    if (this.isSearching ) {
      this.loadAllUsersForSearch();
      return;
    }

    this.rolesService.getUsers(page, pageSize).subscribe({
          next: (response) => {
            this.users = response.data;
            this.filteredUsers = [...this.users];
            this.totalItems = response.total_items; // Asegúrate de usar el campo correcto
            this.pageIndex = response.current_page;
            this.pageSize = pageSize;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al obtener usuarios', error);
            this.loading = false;
          }
        });
  }

  loadAllUsersForSearch(): void {
    this.loading = true;
    this.isSearching = true;

    this.rolesService.getUsersByTrainingCenterSearch().subscribe({
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

  onSearchBlur(): void {
    if (!this.searchTerm.trim()) {
      this.resetToPagination();
    }
  }


  searchUsers(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.resetToPagination();
      return;
    }

    // En lugar de ejecutar la búsqueda directamente, emite al subject
    this.searchSubject.next(term);
  }

  private executeSearch(term: string): void {
    this.loading = true;
    this.isSearching = true;

    this.rolesService.getUsersByTrainingCenterSearch(term).subscribe({
      next: (users) => {
        this.filteredUsers = users.map((user: any) => ({
          ...user,
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

  pageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.getUsers(1, newPageSize); // Vuelve a la primera página con el nuevo tamaño
  }
  resetToPagination(): void {
    this.isSearching = false;
    this.searchTerm = '';
    this.getUsers(this.pageIndex, this.pageSize);
  }
  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.resetToPagination();
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.allUsers.filter(user =>
      user.identity_document?.toLowerCase().includes(term) ||
      user.name?.toLowerCase().includes(term) ||
      user.last_name?.toLowerCase().includes(term) ||
      (user.roles && user.roles.some(role =>
        typeof role === 'string' ?
          role.toLowerCase().includes(term) :
          (role as RoleModel).name?.toLowerCase().includes(term)
      )
    ));
    this.totalItems = this.filteredUsers.length; // Actualiza el total
  }

  changePage(newPage: number) {
    this.pageIndex = newPage;
    this.getUsers(this.pageIndex, this.pageSize);
  }

  toggleUserStatus(user: any): void {
    if (!user || !user.id) {
      console.error('Usuario inválido');
      return;
    }

    const isActive = user.deactivation_date ? false : true;

    this.rolesService.toggleUserStatus(user.id, isActive).subscribe({
      next: (response) => {
        console.log(response.message);
        user.deactivation_date = isActive ? null : new Date().toISOString();
        this.getUsers();
      },
      error: (error) => {
        console.error('Error al cambiar el estado del usuario', error);
      },
    });
  }

  getRoleName(roleId: number): string {
    return this.roles?.find((rol: any) => rol.id === roleId)?.name || 'Desconocido';
  }
}
