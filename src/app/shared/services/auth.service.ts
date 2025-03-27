import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginDTO } from '@shared/dto/login.dto';
import { TokenModel } from '@shared/models/token.model';
import { tap } from 'rxjs/operators';
import { UserModel } from '@shared/models/user.model';
import { Observable } from 'rxjs';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private websocketService = inject(WebSocketService);
  private http = inject(HttpClient);

  user = signal<UserModel | null>(null);

  login(data: LoginDTO): Observable<TokenModel> {
    return this.http.post<TokenModel>('login', data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token); // Guardar el token
        this.websocketService.initializeEcho(); // Reinicializar el WebSocket con el nuevo token
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('pusherTransportNonTLS');
    this.user.set(null); // Limpiar el usuario
    this.websocketService.disconnect(); // Desconectar el WebSocket
  }

  isAuth(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  me(): Observable<UserModel> {
    return this.http.post<UserModel>('me', {}).pipe(
      tap({
        next: (user) => {
          this.user.set(user); // Actualizar el signal con los datos del usuario
          this.subscribeToNotifications(user.id); // Suscribir al canal de notificaciones
        },
        error: (err) => {
          console.error('Error al cargar el usuario:', err);
          this.user.set(null); // En caso de error, establecer como null
        },
      })
    );
  }

  subscribeToNotifications(userId: number): void {
    this.websocketService.listen(`notifications.${userId}`, '.notification.received', (data: any) => {});
  }
}