import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationModel } from '@shared/models/notification-model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private http = inject(HttpClient);
  url:string = 'message'

    getNotifications(data: number){
      return this.http.get<NotificationModel[]>(`${this.url}?filter[user_id]=${data}`);
    }
  }

