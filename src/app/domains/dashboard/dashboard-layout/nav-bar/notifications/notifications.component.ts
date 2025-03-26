import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationModel } from '@shared/models/notification-model';
import { UserModel } from '@shared/models/user.model';
import { NotificationService } from '@shared/services/notification.service';
import { SharedDataService } from '@shared/services/shared-data.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [ReactiveFormsModule,CommonModule,NzAlertModule, NzIconModule],
  standalone: true
})
export class NotificationsComponent implements OnInit {

  private dataSharedService = inject(SharedDataService);
  private notification_service = inject(NotificationService);
  message = { message: '' };
  userId:number = 0
  userModel: UserModel | null = null
  notificationModel: NotificationModel[] | null = null
  notifications = signal<NotificationModel[]>([]);

  ngOnInit(): void {
    this.notifications = this.dataSharedService.notifications;
  }

  markAsRead(id: number, index: number){
    this.notification_service.markAsRead(id).subscribe({
      next: () =>{
        this.notifications.update(notifications => {
          const updatedNotifications = [...notifications];
          updatedNotifications[index] = { ...updatedNotifications[index], read: new Date().toISOString() };
          return updatedNotifications;
        });
      }
    })
  }
}
