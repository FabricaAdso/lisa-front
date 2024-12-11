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
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    CommonModule,
    RouterModule
],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  providers: [
    provideIcons({ featherAirplay, heroUsers }), // Registra los iconos personalizados que se van a usar
  ],
})
export class MenuItemComponent {
  isMenuOpen = false;

  menuItems: MenuItem[] = [
    {
      title: 'Ambientes',
      icon: 'environment',
      route: 'environments',
      theme: 'outline',
    },
    {
      title: 'Areas',
      icon: 'appstore',
      route: 'environments-area',
      theme: 'outline',
    },
    {
      title: 'Asignación',
      icon: 'solution',
      route: 'assists',
      theme: 'outline',
    },
    {
      title: 'Asistencia',
      icon: 'check-square',
      route: 'attendance',
      theme: 'outline',
    },
    {
      title: 'Centro Formativo',
      icon: 'bank',
      route: 'training-centers',
      theme: 'outline',
    },
    {
      title: 'Cursos',
      icon: 'read',
      route: 'course',
      theme: 'outline',
    },
    {
      title: 'Fichas',
      icon: 'profile',
      route: 'fichas',
      theme: 'outline',
    },
    {
      title: 'Justificaciones',
      icon: 'file-text',
      route: 'justification',
      theme: 'outline',
    },
    {
      title: 'Programas',
      icon: 'project',
      route: 'programs',
      theme: 'outline',
    },
    {
      title: 'Roles',
      icon: 'team',
      route: 'roles',
      theme: 'outline',
    },
    {
      title: 'Sedes',
      icon: 'home',
      route: 'headquarters',
      theme: 'outline',
    },
    {
      title: 'Sesiónes',
      icon: 'calendar',
      route: 'session',
      theme: 'outline',
    },
  ];
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
