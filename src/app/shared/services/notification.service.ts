import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationModel } from '@shared/models/notification-model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private http = inject(HttpClient);

  url:string = 'notifications'

    getNotifications(data: number){
      return this.http.get<NotificationModel[]>(`${this.url}?filter[user_id]=${data}`);
    }

    notificationCount(data: number) {
      this.getNotifications(data).subscribe({
          next: (notifications) => {
              const total = notifications.length;
              console.log(`Total de notificaciones: ${total}`);
          },
          error: (err) => {
              console.error('Error al obtener las notificaciones:', err);
          }
      });
  }
}
