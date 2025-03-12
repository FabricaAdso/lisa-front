import { inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { TokenService } from './token.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService{
  private echo: Echo<'pusher'>;
  pusher = Pusher;
  private tokenJWT = inject(TokenService)

  constructor(){
    const token = this.tokenJWT.getToken();

    this.echo = new Echo({
      broadcaster: 'pusher',
      disableStats: true,
      key: environment.pusherKey,
      cluster: environment.pusherCluster,
      forceTLS: environment.pusherForceTLS,
      wsHost: environment.pusherHost,
      wsPort: environment.pusherPort,
        authEndpoint: environment.authApiWebsocketUrl,
      auth: {
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: "application/json"
        },
      },
      //manejo de errores
      error: (error:any) => {
        console.error('Error al conectar con pusher: ' ,error);
      }

    })
  }
  listen(channel: string, event: string, callback: Function) {
    this.echo.private(channel).listen(event, callback);
  }

  unlisten(channel: string) {
    this.echo.leave(channel);
  }

  disconnect() {
    this.echo.disconnect();
  }
}
