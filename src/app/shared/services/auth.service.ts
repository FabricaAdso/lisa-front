import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginDTO } from '@shared/dto/login.dto';
import { TokenModel } from '@shared/models/token.model';
import { tap } from 'rxjs/operators';
import { UserModel } from '@shared/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }

  private http = inject(HttpClient);

  user = signal<UserModel|null>(null);

  login(data:LoginDTO){
    return this.http.post<TokenModel>(`login`,data).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  logout(){
    localStorage.removeItem('token')
    return this.http.post('logout',null)
  }

  isAuth() {
    return localStorage.getItem('token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  me(): Observable<UserModel> {
    return this.http.post<UserModel>('me', {}).pipe(
      tap({
        next: (user) => {
          this.user.set(user);  // Llenar el signal con los datos del usuario
        },
        error: (err) => {
          console.error('Error al cargar el usuario:', err);
          this.user.set(null); // En caso de error, establecer como null
        },
      })
    );
  }

}
