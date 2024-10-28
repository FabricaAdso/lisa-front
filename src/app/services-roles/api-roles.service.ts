import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRolesService {
  private ApiUrl= 'http://127.0.0.1:8000/api'

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.ApiUrl}/login`, credentials);
  }

  // Método para guardar el token en localStorage
  handleLogin(response: any): void {
    localStorage.setItem('token', response.token);
    console.log('Token guardado:', response.token); // Asegúrate de que tu respuesta tenga el token
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken(); // Recupera el token del almacenamiento (localStorage o sessionStorage)
    return token ? true : false;  // Devuelve true si hay un token, false si no lo hay
  }
  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return new Observable(); // Si no hay token, devuelve un observable vacío
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.ApiUrl}/users`, { headers });
  }

  // Método para actualizar los roles de un usuario
  updateUserRoles(userId: number, roles: string[], isActive: boolean): Observable<any> {
    const token = this.getToken(); // Obtener el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.ApiUrl}/users/${userId}/toggle-role`, { roles, isActive }, { headers });
  }
}


