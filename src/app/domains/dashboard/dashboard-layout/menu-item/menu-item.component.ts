import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

interface MenuItem {
  title: string;
  icon?: string;
  route: string | null;
  subMenu?: MenuItem[];
  theme: string;
}

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
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'], // Corregido el typo en styleUrls
  providers: [
    provideIcons({ featherAirplay, heroUsers }), // Registra los iconos personalizados que se van a usar
  ],
})
export class MenuItemsComponent {
  menuItems: MenuItem[] = [
    {
      title: 'Principal',
      icon: 'home', // Icono personalizado
      route: '/dashboard',
      theme: '',
    },
    {
      title: 'Programas',
      icon: 'desktop', // Icono personalizado
      route: null,
      theme: '',
    },
    {
      title: 'Roles',
      icon: 'team', // Icono personalizado
      route: null,
      theme: '',
    },
    {
      title: 'Perfil',
      icon: 'user', // Icono personalizado
      route: null,
      theme: '',
    },
  ];
}
