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
    RouterModule,
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
    { title: 'Roles',
      icon: 'team',
      route: 'roles',
      theme: 'outline',
      
    },

    {
      title: 'Areas',
      icon: 'appstore',
      route: 'environments-area',
      theme: 'outline',
    },

    {
      title: 'Centro Formativo',
      icon: 'bank',
      route: 'training-centers',
      theme: 'outline',
    },

    { title: 'Sedes',
      icon: 'home',
      route: 'headquarters',
      theme: 'outline'
    },

    {
      title: 'Ambientes',
      icon: 'environment',
      route: 'environments',
      theme: 'outline',
    },

    {
      title: 'Programas',

      icon: 'desktop',
      route: 'programs',
      theme: 'outline',
    },

    { title: 'Curso',
      icon: 'book',
      route: 'course',
      theme: 'outline'
    },

    { title: 'Sesiones',
      icon: 'calendar',
      route: 'session',
      theme: 'outline'
    },

    { title: 'Asistencia',
      icon: 'warning',
      route: 'attendance',
      theme: 'outline'
    },
  ];
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
