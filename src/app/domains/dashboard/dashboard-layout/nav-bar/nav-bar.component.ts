import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  HostListener,
  ChangeDetectorRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { DropDownMenuComponent } from '../drop-down-menu/drop-down-menu.component';
import { AuthService } from '@shared/services/auth.service';
import { UserModel } from '@shared/models/user.model';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzMenuModule,
    DropDownMenuComponent
],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  private router = inject(Router);

  private breackpoint_observer = inject(BreakpointObserver);

  user = signal<UserModel | null>(null);  // Signal para almacenar el usuario logueado
  isLoggedIn: boolean = false;

  isDropdownOpen1 = false;
  isDropdownOpen2 = false;

  Image_logo: string = 'assets/images/logosena.png';
  UserImage: string = 'assets/images/logouser.png';

  constructor(private cdr: ChangeDetectorRef) {}

  private auth_service = inject(AuthService);
  ngOnInit(): void {
    this.breackpoint_observer
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe(() => {
        this.isDropdownOpen1 = false;
        this.isDropdownOpen2 = false;
        this.cdr.detectChanges();
      });

      this.isLoggedIn = this.auth_service.isAuth();

      if (this.isLoggedIn) {
        this.auth_service.me().subscribe({
          next: (user: UserModel) => {
            this.user.set(user);
            console.log('Hola', user.first_name, user.first_name);
            this.isLoggedIn = true
          },
          error: (err) => {
            console.error('Error al obtener el usuario:', err);
          }
        });
      }
  }

  login() {
    console.log('Iniciar sesión...');
    this.router.navigate(['auth/login']);
  }

  logout(){
    console.log('Cerrar sesión...');
    this.auth_service.logout();
    // Re dirigir a login
    this.router.navigate(['auth/login']);
  }

  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
    console.log('Abriendo Togglemenu');
// Cierra el segundo menú si está abierto
    if (this.isDropdownOpen2) {
      this.isDropdownOpen2 = false;
    }
    // Forzar detección de cambios si es necesario
    this.cdr.detectChanges();
    console.log('Detectando Cambios');
  }

  toggleDropdown2() {
    console.log( this.isDropdownOpen2);
    this.isDropdownOpen2 = !this.isDropdownOpen2;
    // Cierra el primer menú si está abierto
    if (this.isDropdownOpen1) {
      console.log('Abriendo Togglemenu 2');
      this.isDropdownOpen1 = false;
    }
    // Forzar detección de cambios si es necesario
    this.cdr.detectChanges();
    console.log('Detectando cambios x2');
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const dropdownButton1 = document.querySelector('.dropdown-button1'); // Selector para el primer botón
    const dropdownMenu1 = document.querySelector('.dropdown-menu1'); // Selector para el menú del primer botón
    const dropdownButton2 = document.querySelector('.dropdown-button2'); // Selector para el segundo botón
    const dropdownMenu2 = document.querySelector('.app-drop-down-menu'); // Selector para el segundo menú

    // Cierre del menú 1
    if (
      this.isDropdownOpen1 &&
      dropdownButton1 &&
      !dropdownButton1.contains(target) &&
      dropdownMenu1 &&
      !dropdownMenu1.contains(target)
    ) {
      console.log('Cerrando Togglemenu'),
      this.isDropdownOpen1 = false;
      this.cdr.detectChanges();
    }

    // Cierre del menú 2
    if (
      this.isDropdownOpen2 &&
      dropdownButton2 &&
      !dropdownButton2.contains(target) &&
      dropdownMenu2 &&
      !dropdownMenu2.contains(target)
    ) {
      console.log('Cerrando Togglemenu 2'),
      this.isDropdownOpen2 = false;
      this.cdr.detectChanges();
    }
  }
}
