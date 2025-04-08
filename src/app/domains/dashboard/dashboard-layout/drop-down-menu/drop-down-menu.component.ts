import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { MenuItem } from '@shared/models/menuItems';
import { NzDropDownModule, NzPlacementType } from 'ng-zorro-antd/dropdown';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '@shared/services/auth.service';
import { UserModel } from '@shared/models/user.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { FiterToRoleService } from '@shared/services/fiter-to-role.service';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { menuItems } from '../itemsNav';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { ChangePasswordService } from '@shared/services/change-password.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-drop-down-menu',
  standalone: true,
  imports: [
    NzDropDownModule,
    RouterLink,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    CommonModule,
    RouterModule,
    ChangePasswordModalComponent,
],
  templateUrl: './drop-down-menu.component.html',
  styleUrl: './drop-down-menu.component.css',
})
export class DropDownMenuComponent {
  menuItem = MenuItemComponent
  user = signal<UserModel | null>(null);  // Signal para almacenar el usuario logueado

  listOfPosition: NzPlacementType[] = [
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
    'topLeft',
    'topCenter',
    'topRight',
  ];
  position: NzPlacementType = this.listOfPosition[0]; // Puedes cambiar la posición predeterminada aquí
  constructor(private cdr: ChangeDetectorRef, private filterItems: FiterToRoleService) {}
  private auth_service = inject(AuthService)
  private router = inject(Router);
  private changePasswordService = inject(ChangePasswordService); // Servicio para cambiar contraseña
  private notification = inject(NzNotificationService);


  menuItems = menuItems;
  isLoggedIn: boolean = false;
  isChangePasswordModalVisible = false;

  ngOnInit(): void {
      this.isLoggedIn = this.auth_service.isAuth();

      if (this.isLoggedIn) {
        this.auth_service.me().subscribe({
          next: (user: UserModel) => {
            this.user.set(user);  // Actualizamos el signal con el objeto de usuario
            console.log('Hola', user.name, user.last_name);
          },
          error: (err) => {
            console.error('Error al obtener el usuario:', err);
          }
        });
      }
  }

  isMenuOpen = false;
  toggleMenu2() {
    this.isMenuOpen = !this.isMenuOpen; 
  }

  logout(){
    console.log('Cerrar sesión...');
    this.auth_service.logout();
    this.router.navigate(['auth/login']);
  }
  Items(){
    return this.menuItems.filter(item => this.filterItems.filterItems(item.Role!));
  }


  // Método para abrir el modal de cambio de contraseña
  openChangePasswordModal() {
    this.isChangePasswordModalVisible = true;
  }

  // Método para cerrar el modal
  closeChangePasswordModal() {
    this.isChangePasswordModalVisible = false;
  }

  // Método para manejar el cambio de contraseña
  onPasswordChanged(formData: { currentPassword: string; newPassword: string; newPasswordConfirmation: string }) {
    this.changePasswordService
      .changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.newPasswordConfirmation,
      })
      .subscribe({
        next: () => {
          this.logout();
          this.notification.success(
            'Contraseña actualizada exitosamente',
            'Inicie sesión nuevamente',
            { nzDuration: 5000 }
          );
        },
        error: (error) => {
          this.notification.error('Error al cambiar la contraseña', 'Por favor, verifique los datos ingresados');
          console.error('Error al cambiar la contraseña', error);
        },
      });
  }






  }

