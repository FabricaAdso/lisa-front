import { computed, Injectable, signal } from '@angular/core';
import { NotificationModel } from '@shared/models/notification-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  //iniciamos un array vacio de notificaciones
  private notificationsSignal = signal<NotificationModel[]>([]);

  //meteremos las notificaciones en el array
  updateNotifications(notifications: NotificationModel[]) {
    this.notificationsSignal.set(notifications);
  }

  //desde aqui podemos obtener las notificaciones en tiempo real
  get notifications() {
    return this.notificationsSignal;
  }

  // Computed para contar las notificaciones en tiempo real
  get notificationCount() {
    return computed(() => this.notificationsSignal().length);
  }

}
