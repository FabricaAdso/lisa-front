import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FiterToRoleService {

  constructor() { }
  private auth_Service = inject(AuthService);


  filterItems(rol: string): boolean {
    return !!this.auth_Service.user()?.roles.some(Rol=>Rol == rol);
  }
} 