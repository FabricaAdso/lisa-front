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
  constructor (
    private filterItems: FiterToRoleService,
    private auth_service:AuthService
  ) { }


  menuItems: MenuItem[] = [
    {
      title: 'Ambientes',
      icon: 'environment',
      route: 'environments',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Areas',
      icon: 'appstore',
      route: 'environments-area',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Inasistencias',
      icon: 'user',
      route: 'absences',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Asignación',
      icon: 'solution',
      route: 'assists',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Asistencia',
      icon: 'check-square',
      route: 'attendance',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Centro Formativo',
      icon: 'bank',
      route: 'training-centers',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Cursos',
      icon: 'read',
      route: 'course',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Fichas',
      icon: 'profile',
      route: 'fichas',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Justificaciones',
      icon: 'file-text',
      route: 'justification',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Programas',
      icon: 'project',
      route: 'programs',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Roles',
      icon: 'team',
      route: 'roles',
      theme: 'outline',
      state: false,
      Role: 'Istructor',
    },
    {
      title: 'Sedes',
      icon: 'home',
      route: 'headquarters',
      theme: 'outline',
      state: false,
      Role: 'Instructor',
    },
    {
      title: 'Sesiónes',
      icon: 'calendar',
      route: 'session',
      theme: 'outline',
      state: false,
      Role: 'Instructor',
    },
  ];
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  Items(){
    return this.menuItems.filter(item => this.filterItems.filterItems(item.Role!));
  }

}
