import { Component, Input } from '@angular/core';
import { log } from 'ng-zorro-antd/core/logger';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { MenuService, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { NavBarSidebarComponent } from '../nav-bar-sidebar/nav-bar-sidebar.component';

interface MenuItem {
  title: string;
  icon?: string;
  route: string | null;
  subMenu?: MenuItem[];
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
    NavBarSidebarComponent,
    MenuItemsComponent,
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
})
export class MenuItemsComponent {
  menuItems: MenuItem[] = [
    {
      title: 'Programas',
      icon: 'desktop',
      route: '/programs',
      subMenu: [
        {
          title: 'Fichas',
          icon: 'file',
          route: null,
          subMenu: [
            { title: 'Sesiones', icon: 'file', route: '/sessions' },
            { title: 'Avances', route: '/progress' }, // Añadir un nivel más
          ],
        },
      ],
    },
    {
      title: 'Reports',
      icon: 'file',
      route: null,
      subMenu: [
        { title: 'Report 1', route: '/reports/report1' },
        { title: 'Report 2', route: '/reports/report2' },
        {
          title: 'More Reports',
          route: null,
          subMenu: [
            { title: 'Report 3', route: '/reports/report3' },
            {
              title: 'Deep Report',
              route: null,
              subMenu: [
                { title: 'Report 1', route: '/reports/report1' },
                { title: 'Report 2', route: '/reports/report2' },
                {
                  title: 'More Reports',
                  route: null,
                  subMenu: [
                    { title: 'Report 3', route: '/reports/report3' },
                    {
                      title: 'Deep Report',
                      route: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
