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
import { Subject, takeUntil } from 'rxjs';

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
  private authService = inject(AuthService);

  message = { message: '' };
  userId: number = 0;
  userModel: UserModel | null = null;
  
  private _unSub = new Subject<void>(); // Manejo de desuscripción

  private currentChannel: string | null = null; // Para evitar múltiples suscripciones

  ngOnInit(): void {
    this.listenNotification();
    this.getNotification()
  }

  ngOnDestroy(): void {
    this._unSub.next();
    this._unSub.complete();
    this.unsubscribeFromNotifications();
  }

  listenNotification() {
    this.authService.me()
      .pipe(takeUntil(this._unSub))
      .subscribe({
        next: (user) => {
          if (this.userId !== user?.id) { 
            // Solo actualizamos si el usuario es diferente
            this.unsubscribeFromNotifications(); 
            this.userModel = user || null;
            this.userId = user?.id || 0;

            if (this.userId) {
              this.getNotification();
              this.subscribeToNotifications();
            }
          }
        },
        error: (err) => {
          console.error('Error al obtener el usuario:', err);
          this.userModel = null;
          this.userId = 0;
          this.dataSharedService.updateNotifications([]);
        },
      });
  }

  getNotification() {
    this.notificationService.getNotifications()
      .pipe(takeUntil(this._unSub))
      .subscribe({
        next: (notifications) => {
          this.notificationModel = notifications;
          this.dataSharedService.updateNotifications(notifications);
        },
      });
  }

  subscribeToNotifications() {
    if (this.userId) {
      const channel = `notifications.${this.userId}`;

      if (this.currentChannel === channel) {
        return; // Si ya estamos suscritos, no volvemos a hacerlo
      }

      this.currentChannel = channel;
      this.websocketService.listen(channel, '.notification.received', (data: any) => {
        this.dataSharedService.updateNotifications([...this.dataSharedService.notifications(), data]);
      });
    }
  }

  unsubscribeFromNotifications() {
    if (this.currentChannel) {
      this.websocketService.unlisten(this.currentChannel);
      this.currentChannel = null;
    }
    this.dataSharedService.updateNotifications([]);
  }
}
