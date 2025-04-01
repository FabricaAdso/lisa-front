import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotificationModel } from '@shared/models/notification-model';
import { NotificationService } from '@shared/services/notification.service';
import { SharedDataService } from '@shared/services/shared-data.service';
import { WebSocketService } from '@shared/services/websocket.service';
import { AuthService } from '@shared/services/auth.service';
import { UserModel } from '@shared/models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    CommonModule,
    NavBarComponent,
    MenuItemComponent,
    RouterOutlet,
    NzBreadCrumbModule
],
  viewProviders: [provideIcons({ featherAirplay, heroUsers })],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent implements OnInit,OnDestroy{

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
              this.getNotification();
              this.subscribeToNotifications();
              
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
            this.dataSharedService.updateMessages(notifications)
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
          this.dataSharedService.updateMessages([...this.dataSharedService.messages(), data]);
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
