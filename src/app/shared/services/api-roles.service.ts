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
    return this.http.get(`users-by-training-center`);
  }
   // Activar o desactivar un usuario
   toggleUserStatus(userId: string, isActive: boolean): Observable<any> {
    return this.http.post(`users/${userId}/deactivate`, { active: isActive });
  }

  // assignRoles(userId: string, p0: string, roles: number[]): Observable<any> {
  //   const payload = {
  //     user_id: userId,  // ⚠️ El backend espera `user_id`, no `userId`
  //     role_ids: roles   // ⚠️ El backend espera `role_ids`, no `roles`
  //   };
  //   return this.http.post(`assign-role`, payload);
  // }
  assignRoles(userId: string, roles: number[]): Observable<any> {
    return this.http.post(`assign-role`, { user_id: userId, role_ids: roles });
  }

}

