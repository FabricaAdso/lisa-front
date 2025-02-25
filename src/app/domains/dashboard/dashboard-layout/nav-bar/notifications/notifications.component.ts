import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationModel } from '@shared/models/notification-model';
import { UserModel } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { NotificationService } from '@shared/services/notification.service';
import { SharedDataService } from '@shared/services/shared-data.service';
import { WebSocketService } from '@shared/services/websocket.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [ReactiveFormsModule,CommonModule,NzAlertModule],
  standalone: true
})
export class NotificationsComponent implements OnInit {

  private dataSharedService = inject(SharedDataService);
  private websocketService = inject(WebSocketService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService); // Suponiendo que tienes un servicio de autenticación
  message = { message: '' };
  userId:number = 0
  userModel: UserModel | null = null
  notificationModel: NotificationModel[] | null = null

  ngOnInit(): void {
    this.listenNotification()
  }
    

  listenNotification(){
    // Obtener el userId desde el servicio de autenticación
    this.authService.me().subscribe({
      next: (user) => {
        this.userModel = user;
        this.userId = this.userModel!.id
        this.getNotification(this.userId);
        this.notificationCount(this.userId);
        this.websocketService.listen(`notifications.${this.userId}`, '.notification.received', (data: any) => {
        });
      }
    }); 
  }


  getNotification(data:number){
    this.notificationService.getNotifications(data)
      .subscribe({
      next: (notificacion) => {
        this.notificationModel = notificacion.map((notificationes) => {
          return {
            id: notificationes.id,
            message: notificationes.message,
            type: notificationes.type,
            user_id: notificationes.user_id,
            user_recieved: notificationes.user_recieved,
          };
        });
      }
    });

  }

  notificationCount(data:number){
    this.notificationService.notificationCount(data)
  }

  


  

}
