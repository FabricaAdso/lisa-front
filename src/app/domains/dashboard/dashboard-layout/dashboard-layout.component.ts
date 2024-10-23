import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { MenuService, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { NavBarSidebarComponent } from './nav-bar-sidebar/nav-bar-sidebar.component';
import { MenuItemsComponent } from './menu-items/menu-item.component';

interface MenuItem {
  title: string;
  icon?: string;
  route: string | null;
  subMenu?: MenuItem[];
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NgIconComponent,
    CommonModule,
    NavBarSidebarComponent,
    MenuItemsComponent,
    // Importar el componente recursivo
  ],
  viewProviders: [provideIcons({ featherAirplay, heroUsers })],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent {}
