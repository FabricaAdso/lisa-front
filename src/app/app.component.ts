import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./domains/pages/login-page/login-page.component";
import { WebSocketService } from '@shared/services/echo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lisa-front';

  // notifications: string[] = [];  // Lista para almacenar las notificaciones

  // private notificationService = inject(WebSocketService)

  // ngOnInit() {
  //   // Nos suscribimos al servicio para recibir las notificaciones
  //   this.notificationService.getNotifications().subscribe((message: string) => {
  //     this.notifications.push(message);  // Agregamos la nueva notificación al array
  //     this.showNotification(message);    // Llamamos a la función para mostrar la notificación
  //     console.log(message)
  //   });
    
  // }

  // // Función para mostrar las notificaciones
  // showNotification(message: string) {
  //   alert('Nueva notificación: ' + message);
  //   console.log(message) // Esto es solo un ejemplo, puedes usar un snackbar, toast, etc.
  // }
  
}
