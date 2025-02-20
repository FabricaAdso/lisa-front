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
  //obtner lso roles 
  getRoles():Observable<any>{
    return this.http.get(`roles`,);
  }

//asignar roles a un usuario
  assignRoles(userId: string, roles: number[]): Observable<any> {
    return this.http.post(`assign-role`, { user_id: userId, role_ids: roles });
  }


}

