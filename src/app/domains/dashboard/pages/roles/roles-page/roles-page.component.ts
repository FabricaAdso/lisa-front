import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiRolesService } from '@shared/services/api-roles.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChargeExcelService } from '@shared/services/charge-excel.service';
import { forkJoin } from 'rxjs';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { ChargeButtonComponent } from './charge-button/charge-button.component';

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
    ChargeButtonComponent
],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css'
})
export class RolesComponent implements OnInit {

  //logica para abrir el boton de cargue masivo

  @ViewChild('chargeButton') chargeButton:any = ChargeButtonComponent;

  private chargeExcelService = inject(ChargeExcelService);

  showModalCargue(): void {
    this.chargeButton.isVisibleCargue = true;
    console.log(this.isVisibleCargue);

  }




  changePage(newPage: number) {
    this.pageIndex = newPage;
    this.getUsers(this.pageIndex, this.pageSize);
  }
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
  isVisibleCargue = true;
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

  tabs = [
    { title: 'Pestaña 1', description: 'Cargar archivo para la API 1', apiRoute: '/api/upload1' },
    { title: 'Pestaña 2', description: 'Cargar archivo para la API 2', apiRoute: '/api/upload2' },
    { title: 'Pestaña 3', description: 'Cargar archivo para la API 3', apiRoute: '/api/upload3' }
  ];

  selectedFile: File | null = null;

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

  private userService = inject(ApiRolesService);

  ngOnInit(): void {
    this.getUsers();
    this.allRoles()
  }

  saveChargeExcel(){
    const dataSub = forkJoin ([
      this.chargeExcelService.postExcel,
    ])
  }

  allRoles() {
    this.userService.getRoles().subscribe({
      next: (data) => {
        console.log("roles", data)
        this.roles = data
      },
      error: (error) => {

      }
    })
  }

  //mostrar todos los usuarios con su respectivo rol,traidos desde el servicio
  getUsers(page: number = 1, pageSize: number = 8): void {
    this.userService.getUsers(page, pageSize).subscribe({
        next: (response) => {
            console.log('Respuesta del backend:', response); // Verifica la estructura de la respuesta

            // Extrae los datos de la respuesta
            const { data, total, current_page, per_page } = response;

            // Mapea los usuarios y extrae los roles
            this.users = data.map((user: { training_centers?: any[]; }) => ({
                ...user,
                roles: user.training_centers?.map((tc: { role_id: any; }) => tc.role_id) || []
            }));
            console.log(this.users);

            // Asigna los usuarios filtrados
            this.filteredUsers = [...this.users];

            // Actualiza las propiedades de paginación
            this.totalItems = total;
            this.pageIndex = current_page;
            this.pageSize = per_page;
        },
        error: (error) => console.error('Error al obtener usuarios', error)
    });
}
  // Filtrar usuarios por nombre, apellido o documento
  searchUsers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.identity_document.toLowerCase().includes(term) ||
      user.name.toLowerCase().includes(term) ||
      user.last_name.toLowerCase().includes(term)
    );
    this.pageIndex = 1;
  }

  
  showModal(user: any): void {
    this.isVisible = true;
    this.selectedUser = user;
    this.selectedRoles = [...user.roles];
    console.log(this.selectedRoles)
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
    this.isVisibleCargue = false;
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
    this.isVisibleCargue = false;
  }
  onRolesChange(selected: string[]): void {
    this.selectedRoles = selected; // Sincronizar los roles seleccionados
  }

  getRoleName(roleId: number): string {
    return this.roles?.find((rol: any) => rol.id === roleId)?.name || 'Desconocido';
  }
  pageIndexChange(item: any) {
    this.pageIndex = item
    console.log(this.pageIndex)
  }


  
  
}



