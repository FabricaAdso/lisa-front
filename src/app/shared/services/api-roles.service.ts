import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRolesService{
  
  private http = inject(HttpClient);

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`users`);
  }

  // Activar o desactivar un usuario
  toggleUserStatus(userId: string, isActive: boolean): Observable<any> {
    const url = `users/${userId}/deactivate`;
    return this.http.post(url, { active: isActive });
  }

  // Asignar roles a un usuario
  toggleUserRole(userId: string, roles: string[]): Observable<any> {
    const url = `users/${userId}/toggle-role`;
    return this.http.post(url, { roles });
  }
}

