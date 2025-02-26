import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./domains/pages/login-page/login-page.component";
import { WebSocketService } from '@shared/services/websocket.service';
import { AuthService } from '@shared/services/auth.service';
import { UserModel } from '@shared/models/user.model';
import { SharedDataService } from '@shared/services/shared-data.service';
import { NotificationService } from '@shared/services/notification.service';
import { NotificationModel } from '@shared/models/notification-model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'lisa-front';

  notificationModel: NotificationModel[] = [];
  private notificationService = inject(NotificationService);
  private dataSharedService = inject(SharedDataService);
  private websocketService = inject(WebSocketService);
  private authService = inject(AuthService); // Suponiendo que tienes un servicio de autenticación
  message = { message: '' };
  userId: number = 0
  userModel: UserModel | null = null

  ngOnInit(): void {
    this.listenNotification()
  }

  listenNotification() {
    this.authService.me().subscribe({
      next: (user) => {
        this.userModel = user;
        this.userId = this.userModel!.id
        this.getNotification(this.userId);

        this.websocketService.listen(`notifications.${this.userId}`, '.notification.received', (data: any) => {
          this.dataSharedService.updateNotifications([...this.dataSharedService.notifications(),data])
        });
      }
    });
  }

  getNotification(data: number) {
    this.notificationService.getNotifications(data).subscribe({
      next: (notifications) => {
        this.notificationModel = notifications.map((notificationes) => {
          return {
            id: notificationes.id,
            message: notificationes.message,
            type: notificationes.type,
            user_id: notificationes.user_id,
            user_recieved: notificationes.user_recieved,
          };
        });
        const total = notifications.length;
        console.log('Total de notificaciones inicial:', total);
        this.dataSharedService.updateNotifications(notifications)
      },
    });
  }
}
