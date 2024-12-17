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
import { PermissionDirective } from '@shared/directives/permission.directive';
import { FiterToRoleService } from '@shared/services/fiter-to-role.service';
import { AuthService } from '@shared/services/auth.service';
import { menuItems } from '../itemsNav';

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
  menuItems = menuItems;
  isMenuOpen = false;
  constructor (
    private filterItems: FiterToRoleService,
    private auth_service:AuthService
  ) { }

  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  Items(){
    return this.menuItems.filter(item => this.filterItems.filterItems(item.Role!));
  }

}
