import { inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { TokenService } from './token.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private echo: Echo;
  pusher = Pusher;
  private tokenJWT = inject(TokenService)
  private notificationSubject = new Subject<any>();

  constructor() {

    const token = this.tokenJWT.getToken();
    // console.log('Token en Echo:', token );

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'odgldod1lgmvspxovpsi',
      cluster: 'mt1',
      wsHost: '127.0.0.1',
      wsPort: 8080,
      forceTLS: false,
      disableStats: true,
      encrypted: false, // Cambia esto si estás usando HTTPS
      authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${this.tokenJWT.getToken()}`,
        },
      },
    });

    // console.log(this.echo)
  }

  // Método para escuchar el canal privado
  public listenToPrivateChannel(id: number) {
    this.echo.channel('notifications')
      .listen('SendMessage', (event: any) => {
        console.log('Mensaje recibido:', event);
        // Aquí puedes manejar el evento, por ejemplo, actualizar la interfaz
      });
    }

    getNotifications() {
      return this.notificationSubject.asObservable(); // Permite que otros componentes se suscriban
    }

}
