import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout'; // Módulo de diseño de Ng Zorro
import { NzMenuModule } from 'ng-zorro-antd/menu'; // Módulo de menú de Ng Zorro
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb'; // Módulo de breadcrumbs de Ng Zorro
import { NzIconModule } from 'ng-zorro-antd/icon'; // Módulo de iconos de Ng Zorro
import { RouterOutlet } from '@angular/router'; // Módulo de enrutamiento de Angular
import { NgIconComponent, provideIcons } from '@ng-icons/core'; // Módulo para manejar iconos
import { featherAirplay } from '@ng-icons/feather-icons'; // Icono de Feather
import { heroUsers } from '@ng-icons/heroicons/outline'; // Icono de Heroicons
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { NavBarSidebarComponent } from './nav-bar-sidebar/nav-bar-sidebar.component'; // Importación del componente de barra lateral

// Definición de la interfaz MenuItem
interface MenuItem {
  title: string; // Título del elemento del menú
  icon?: string; // Icono opcional del elemento
  route: string | null; // Ruta a la que enlaza el elemento, puede ser nulo
  subMenu?: MenuItem[]; // Submenú opcional
}

@Component({
  selector: 'app-dashboard-layout', // Selector del componente
  standalone: true, // Componente independiente
  imports: [ // Importaciones necesarias para el componente
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NgIconComponent,
    CommonModule,
    NavBarSidebarComponent,
  ],
  viewProviders: [provideIcons({ featherAirplay, heroUsers })], // Proveer iconos
  templateUrl: './dashboard-layout.component.html', // URL de la plantilla HTML
  styleUrls: ['./dashboard-layout.component.css'], // URL de los estilos CSS
})
export class DashboardLayoutComponent {
  menuItems: MenuItem[] = [ // Array de elementos del menú
    {
      title: 'Programas', // Título del primer elemento
      icon: 'desktop', // Icono del primer elemento
      route: '/programs', // Ruta del primer elemento
      subMenu: [ // Submenú del primer elemento
        {
          title: 'Fichas', // Título del submenú
          icon: 'file', // Icono del submenú
          route: null, // Ruta nula, indicando que no tiene ruta directa
          subMenu: [{ title: 'Sesiones', icon: 'page', route: '/sessions' }], // Submenú anidado
        },
      ],
    },
    {
      title: 'Reports', // Título del segundo elemento
      icon: 'file', // Icono del segundo elemento
      route: null, // Ruta nula, indicando que no tiene ruta directa
      subMenu: [ // Submenú del segundo elemento
        { title: 'Report 1', route: '/reports/report1' }, // Elemento del submenú con ruta
        { title: 'Report 2', route: '/reports/report2' }, // Elemento del submenú con ruta
      ],
    },
    // Otros elementos...
  ];
}
