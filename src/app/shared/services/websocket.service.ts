import { Injectable, inject } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { TokenService } from './token.service';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private echo: Echo<'pusher'> | null = null;
  puhser = Pusher
  private tokenJWT = inject(TokenService);

  constructor() {
    this.initializeEcho(); // Inicializar Echo al crear el servicio
  }

  // Reinicializar Echo con un nuevo token
  initializeEcho(): void {
    const token = this.tokenJWT.getToken();

    if (this.echo) {
      this.echo.disconnect(); // Desconectar la instancia anterior
    }

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
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
      error: (error: any) => {
        console.error('Error al conectar con Pusher:', error);
      },
    });
  }

  // Escuchar un canal
  listen(channel: string, event: string, callback: Function): void {
    if (!this.echo) {
      console.error('Echo no está inicializado');
      return;
    }
    this.echo.private(channel).listen(event, callback);
  }

  // Dejar de escuchar un canal
  unlisten(channel: string): void {
    if (!this.echo) {
      console.error('Echo no está inicializado');
      return;
    }
    this.echo.leave(channel);
  }

  // Desconectar Echo
  disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
    }
  }
}