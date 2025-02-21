import { Component, inject, OnInit } from '@angular/core';
import { UserModel } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { WebSocketService } from '@shared/services/websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true
})
export class NotificationsComponent implements OnInit {

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
