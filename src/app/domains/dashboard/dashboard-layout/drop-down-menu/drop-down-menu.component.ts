import { Component, inject } from '@angular/core';
import { MenuItem } from '@shared/models/menuItems';
import { NzDropDownModule, NzPlacementType } from 'ng-zorro-antd/dropdown';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-drop-down-menu',
  standalone: true,
  imports: [
    NzDropDownModule,
    MenuItemComponent,
    RouterLink,
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NgIconComponent,
    CommonModule,
    NavBarComponent,
    RouterModule,
  ],
  templateUrl: './drop-down-menu.component.html',
  styleUrl: './drop-down-menu.component.css',
})
export class DropDownMenuComponent {
  listOfPosition: NzPlacementType[] = [
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
    'topLeft',
    'topCenter',
    'topRight',
  ];
  position: NzPlacementType = this.listOfPosition[0]; // Puedes cambiar la posición predeterminada aquí
  private auth_service = inject(AuthService)
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      title: 'Roles',
      icon: 'team', // Icono personalizado
      route: 'roles',
      theme: 'outline',
    },
    {
      title: 'Administrar Áreas',
      icon: 'appstore', // Icono personalizado
      route: 'environments-area',
      theme: 'outline',
    },
    {
      title: 'Training Centres',
      icon: 'bank', // Icono personalizado
      route: 'training-centers',
      theme: 'outline',
    },
    {
      title: 'Sedes',
      icon: 'home', // Icono personalizado
      route: 'headquarters',
      theme: 'outline',
    },
    {
      title: 'Ambientes',
      icon: 'environment', // Icono personalizado
      route: 'environments',
      theme: 'outline',
    },
    {
      title: 'Programas',
      icon: 'desktop', // Icono personalizado
      route: 'programs',
      theme: 'outline',
    },
    {
      title: 'Curso',
      icon: 'book', // Icono personalizado
      route: 'course',
      theme: 'outline',
    },
    {
      title: 'Sesiones',
      icon: 'calendar', // Icono personalizado
      route: 'calendar',
      theme: 'outline',
    },
  ];
  isMenuOpen = false;
  toggleMenu2() {
    this.isMenuOpen = !this.isMenuOpen; // Alterna el estado del menú desplegable
  }

  logout(){
    console.log('Cerrar sesión...');
    this.auth_service.logout();
    // Re dirigir a login
    this.router.navigate(['auth/login']);
  }
  }

