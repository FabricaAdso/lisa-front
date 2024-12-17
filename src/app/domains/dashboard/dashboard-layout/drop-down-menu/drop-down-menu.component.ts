import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { MenuItem } from '@shared/models/menuItems';
import { NzDropDownModule, NzPlacementType } from 'ng-zorro-antd/dropdown';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '@shared/services/auth.service';
import { UserModel } from '@shared/models/user.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { FiterToRoleService } from '@shared/services/fiter-to-role.service';

@Component({
  selector: 'app-drop-down-menu',
  standalone: true,
  imports: [
    NzDropDownModule,
    RouterLink,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    CommonModule,
    RouterModule
],
  templateUrl: './drop-down-menu.component.html',
  styleUrl: './drop-down-menu.component.css',
})
export class DropDownMenuComponent {

  user = signal<UserModel | null>(null);  // Signal para almacenar el usuario logueado

  listOfPosition: NzPlacementType[] = [
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
    'topLeft',
    'topCenter',
    'topRight',
  ];
  position: NzPlacementType = this.listOfPosition[0]; // Puedes cambiar la posición predeterminada aquí
  constructor(private cdr: ChangeDetectorRef, private filterItems: FiterToRoleService,) {}
  private auth_service = inject(AuthService)
  private router = inject(Router);

  isLoggedIn: boolean = false;

  ngOnInit(): void {
      this.isLoggedIn = this.auth_service.isAuth();

      if (this.isLoggedIn) {
        // Suscribimos al signal con la respuesta del método 'me()' para obtener los datos del usuario
        this.auth_service.me().subscribe({
          next: (user: UserModel) => {
            this.user.set(user);  // Actualizamos el signal con el objeto de usuario
            console.log('Hola', user.name, user.last_name);
          },
          error: (err) => {
            console.error('Error al obtener el usuario:', err);
          }
        });
      }
  }

  menuItems: MenuItem[] = [
    {
      title: 'Ambientes',
      icon: 'environment',
      route: 'environments',
      theme: 'outline',
      Role:'Instructor' 
    },
    {
      title: 'Areas',
      icon: 'appstore',
      route: 'environments-area',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Inasistencias',
      icon: 'user',
      route: 'absences',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Asignación',
      icon: 'solution',
      route: 'assists',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Asistencia',
      icon: 'check-square',
      route: 'attendance',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Centro Formativo',
      icon: 'bank',
      route: 'training-centers',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Cursos',
      icon: 'read',
      route: 'course',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Fichas',
      icon: 'profile',
      route: 'fichas',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Justificaciones',
      icon: 'file-text',
      route: 'justification',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Programas',
      icon: 'project',
      route: 'programs',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Roles',
      icon: 'team',
      route: 'roles',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Sedes',
      icon: 'home',
      route: 'headquarters',
      theme: 'outline',
      Role:'Instructor'
    },
    {
      title: 'Sesiónes',
      icon: 'calendar',
      route: 'session',
      theme: 'outline',
      Role:'Instructor'
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
  Items(){
    return this.menuItems.filter(item => this.filterItems.filterItems(item.Role!));
  }
  }

