import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { DropDownMenuComponent } from '../drop-down-menu/drop-down-menu.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzIconModule,
    NzMenuModule,
    MenuItemComponent,
    DropDownMenuComponent,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  private breackpoint_observer = inject(BreakpointObserver);

  isLoggedIn = true;
  userName = 'Yesid Jimenez';
  isDropdownOpen1 = false;
  isDropdownOpen2 = false;

  Image_logo: string = 'assets/images/logosena.png';
  UserImage: string = 'assets/images/userimage.jpeg';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.breackpoint_observer.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe(() => {
        this.isDropdownOpen1 = false;
        this.isDropdownOpen2 = false;
        this.cdr.detectChanges();
      });
  }

  login() {
    console.log('Iniciar sesión...');
    this.isLoggedIn = true;
  }

  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
    // Cierra el segundo menú si está abierto
    if (this.isDropdownOpen2) {
      this.isDropdownOpen2 = false;
    }
    // Forzar detección de cambios si es necesario
    this.cdr.detectChanges();
  }

  logout() {
    console.log('Cerrando sesión...');
  }

  toggleDropdown2() {
    console.log('yesid', this.isDropdownOpen2);
    this.isDropdownOpen2 = !this.isDropdownOpen2;
    // Cierra el primer menú si está abierto
    if (this.isDropdownOpen1) {
      this.isDropdownOpen1 = false;
    }
    // Forzar detección de cambios si es necesario
    this.cdr.detectChanges();
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
      this.isDropdownOpen2 = false;
      this.cdr.detectChanges();
    }
  }
}
