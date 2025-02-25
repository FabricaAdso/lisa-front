import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./domains/pages/login-page/login-page.component";
import { WebSocketService } from '@shared/services/websocket.service';
import { AuthService } from '@shared/services/auth.service';
import { UserModel } from '@shared/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'lisa-front';

    private websocketService = inject(WebSocketService);
    private authService = inject(AuthService); // Suponiendo que tienes un servicio de autenticación
    message = { message: '' };
    userId:number = 0
    userModel: UserModel | null = null
  
    ngOnInit(): void {
      this.listenNotification()
    }

    listenNotification(){
      // Obtener el userId desde el servicio de autenticación
      this.authService.me().subscribe({
        next: (user) => {
          this.userModel = user;
          this.userId = this.userModel!.id
  
          this.websocketService.listen(`notifications.${this.userId}`, '.notification.received', (data: any) => {
            console.log('Mensaje recibido:', data);
          });
        }
      }); 
    }

    



  
}
