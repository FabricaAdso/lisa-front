import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MenuItem } from '@shared/models/menuItems';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NgIconComponent,
    CommonModule,
    NavBarComponent,
    RouterModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'], // Corregido el typo en styleUrls
  providers: [
    provideIcons({ featherAirplay, heroUsers }), // Registra los iconos personalizados que se van a usar
  ],
})
export class MenuItemComponent {

  isMenuOpen = false;
  // Ahora menuItems es una propiedad de la clase, accesible en la plantilla
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
      route: 'session',
      theme: 'outline',
    },
    {
      title: 'No Autenticado',
      icon: 'alert', // Icono personalizado
      route: 'error_401',
      theme: 'outline',
    },
    {
      title: 'No Autorizado',
      icon: 'unlock', // Icono personalizado
      route: 'error_403',
      theme: 'outline',
    },
    {
      title: 'No Encontrado',
      icon: 'file-unknown', // Icono personalizado
      route: 'error_404',
      theme: 'outline',
    },

    {
      title: 'Error de Servidor',
      icon: 'warning', // Icono personalizado
      route: 'error_500',
      theme: 'outline',
    },

    {
      title: 'Tiempo Agotado',
      icon: 'loading', // Icono personalizado
      route: 'error_504',
      theme: 'outline',
    }
  ];
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Alterna el estado del menú desplegable
  }
}
