import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from "../../pages/login-page/login-page.component";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RegisterPageComponent } from '../../pages/register-page/register-page.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet,FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

  RegisterView:boolean = false;
  private router = inject(Router);

  ngOnInit(): void {

    // Verifica la ruta activa al cargar el componente
    this.RegisterView = this.router.url.includes('auth/register');

    // Escucha cambios en la ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Cambia la vista basado en la ruta actual
        this.RegisterView = event.urlAfterRedirects.includes('auth/register');
      }
    });
  }

}
