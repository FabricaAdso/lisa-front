import { computed, Injectable, signal } from '@angular/core';
import { NotificationModel } from '@shared/models/notification-model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  
  constructor() { }
  
  //iniciamos un array vacio de notificaciones y mensajes
  private notificationsSignal = signal<NotificationModel[]>([]);
  private messagesSignal = signal<NotificationModel[]>([]);
  private closeDropdownMenuSignal = signal<boolean>(false);
  
  //meteremos las notificaciones en el array
  updateNotifications(notifications: NotificationModel[]) {
    this.notificationsSignal.set(notifications.filter(n => !n.read_at || n.read_at === null));
  }

  updateMessages(messages: NotificationModel[]) {
    this.messagesSignal.set(messages);
  }

  updateCloseDropdownMenu(closeDropdownMenu: boolean) {
    this.closeDropdownMenuSignal.set(closeDropdownMenu);
  }


  //desde aqui podemos obtener las notificaciones en tiempo real
  get notifications() {
    return this.notificationsSignal;
  }

  get messages() {
    return this.messagesSignal;
  }

  get closeDropdownMenu() {
    return this.closeDropdownMenuSignal;
  }

  // Computed para contar las notificaciones en tiempo real
  get notificationCount() {
    return computed(() => this.notificationsSignal().length);
  }

}

