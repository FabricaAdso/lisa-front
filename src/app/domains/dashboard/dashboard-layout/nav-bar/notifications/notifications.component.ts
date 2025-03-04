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
  message = { message: '' };
  userId:number = 0
  userModel: UserModel | null = null
  notificationModel: NotificationModel[] | null = null

  ngOnInit(): void {
    
  }

  notifications = this.dataSharedService.notifications;
  

}
